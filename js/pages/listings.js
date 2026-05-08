import { getListings } from "../api/listings.js";
import { renderListingCard } from "../ui/renderListingCard.js";
import { clearMessage, showMessage } from "../ui/showMessage.js";

const messageSelector = "[data-listings-message]";
const pageSize = 12;
let allListings = [];
let currentPage = 1;
let canLoadMore = false;

function getListingText(listing) {
  const tags = listing.tags || [];

  return [listing.title, listing.description, listing.seller?.name, ...tags]
    .join(" ")
    .toLowerCase();
}

function filterListings(listings, searchValue) {
  const searchText = searchValue.trim().toLowerCase();

  if (!searchText) {
    return listings;
  }

  return listings.filter((listing) => getListingText(listing).includes(searchText));
}

function getSort(sortValue) {
  const [sort, sortOrder] = sortValue.split("-");

  return { sort, sortOrder };
}

function getFilterValues() {
  const searchInput = document.querySelector("[data-listings-search]");
  const tagInput = document.querySelector("[data-listings-tag]");
  const sortSelect = document.querySelector("[data-listings-sort]");
  const sort = getSort(sortSelect?.value || "created-desc");

  return {
    search: searchInput?.value || "",
    tag: tagInput?.value.trim() || "",
    sort: sort.sort,
    sortOrder: sort.sortOrder,
  };
}

function showListings(listingsContainer, listings) {
  const filters = getFilterValues();
  const visibleListings = filterListings(listings, filters.search);

  if (visibleListings.length === 0 && listings.length > 0) {
    listingsContainer.replaceChildren();
    showMessage("No results found in loaded auctions.", "info", messageSelector);
    return;
  }

  if (listings.length === 0) {
    listingsContainer.replaceChildren();
    showMessage("No auctions found.", "info", messageSelector);
    return;
  }

  clearMessage(messageSelector);
  listingsContainer.replaceChildren(...visibleListings.map(renderListingCard));
}

function updateLoadMoreButton(button) {
  if (!button) {
    return;
  }

  button.disabled = false;
  button.textContent = "Load More";
  button.classList.toggle("is-hidden", !canLoadMore);
}

async function loadListings(listingsContainer, loadMoreButton, resetList = false) {
  const filters = getFilterValues();

  if (resetList) {
    currentPage = 1;
    allListings = [];
  }

  showMessage("Loading auctions...", "info", messageSelector);

  try {
    const newListings = await getListings({
      limit: pageSize,
      page: currentPage,
      tag: filters.tag,
      sort: filters.sort,
      sortOrder: filters.sortOrder,
    });
    const loadedListings = newListings || [];

    allListings = [...allListings, ...loadedListings];
    canLoadMore = loadedListings.length === pageSize;
    currentPage += 1;

    showListings(listingsContainer, allListings);
    updateLoadMoreButton(loadMoreButton);
  } catch (error) {
    listingsContainer.replaceChildren();
    showMessage(error.message, "error", messageSelector);
    canLoadMore = false;
    updateLoadMoreButton(loadMoreButton);
  }
}

export async function setupListingsPage() {
  const listingsContainer = document.querySelector("[data-listings-container]");
  const filterForm = document.querySelector("[data-listings-filter-form]");
  const searchInput = document.querySelector("[data-listings-search]");
  const clearButton = document.querySelector("[data-clear-listing-filters]");
  const loadMoreButton = document.querySelector("[data-load-more-listings]");

  if (!listingsContainer) {
    return;
  }

  await loadListings(listingsContainer, loadMoreButton, true);

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      showListings(listingsContainer, allListings);
    });
  }

  if (filterForm) {
    filterForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await loadListings(listingsContainer, loadMoreButton, true);
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", async () => {
      filterForm.reset();
      await loadListings(listingsContainer, loadMoreButton, true);
    });
  }

  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", async () => {
      loadMoreButton.disabled = true;
      loadMoreButton.textContent = "Loading...";
      await loadListings(listingsContainer, loadMoreButton);
    });
  }
}
