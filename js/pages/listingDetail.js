import { createBid } from "../api/bids.js";
import { deleteListing, getListing } from "../api/listings.js";
import { getProfile } from "../api/profiles.js";
import { clearMessage, showMessage } from "../ui/showMessage.js";
import { setupNavbar } from "../ui/updateNavbar.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import { formatTimeLeft } from "../utils/formatDate.js";
import { getUser, isLoggedIn, saveUser } from "../utils/storage.js";

const fallbackImage =
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80";
const messageSelector = "[data-listing-message]";

function getImages(listing) {
  if (listing.media && listing.media.length > 0) {
    return listing.media;
  }

  return [{ url: fallbackImage, alt: listing.title }];
}

function getCurrentBid(listing) {
  if (!listing.bids || listing.bids.length === 0) {
    return 0;
  }

  return Math.max(...listing.bids.map((bid) => bid.amount));
}

function isOwner(listing) {
  const user = getUser();

  return Boolean(user && listing.seller?.name === user.name);
}

async function handleDeleteClick(listing, button) {
  const shouldDelete = window.confirm("Delete this listing?");

  if (!shouldDelete) {
    return;
  }

  button.disabled = true;
  button.textContent = "Deleting...";

  try {
    await deleteListing(listing.id);
    showMessage("Listing deleted.", "success", messageSelector);

    setTimeout(() => {
      window.location.href = "/listings.html";
    }, 800);
  } catch (error) {
    showMessage(error.message, "error", messageSelector);
    button.disabled = false;
    button.textContent = "Delete";
  }
}

function renderAvatar(avatarUrl, name, className) {
  if (avatarUrl) {
    const image = document.createElement("img");
    image.className = `${className}__avatar-image`;
    image.src = avatarUrl;
    image.alt = name;

    return image;
  }

  const icon = document.createElement("i");
  icon.className = "bi bi-person-fill";

  return icon;
}

function renderPhotoThumb(image, title) {
  const column = document.createElement("div");
  const thumb = document.createElement("img");

  column.className = "col";
  thumb.className = "listing-detail__thumb w-100";
  thumb.src = image.url || fallbackImage;
  thumb.alt = image.alt || title;

  column.append(thumb);
  return column;
}

function renderMorePhotosThumb(image, extraPhotos) {
  const column = document.createElement("div");
  const wrapper = document.createElement("div");
  const thumb = document.createElement("img");
  const text = document.createElement("span");

  column.className = "col";
  wrapper.className = "listing-detail__more position-relative overflow-hidden";
  thumb.className = "listing-detail__thumb w-100";
  text.className =
    "listing-detail__more-text position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center";

  thumb.src = image.url || fallbackImage;
  thumb.alt = "";
  text.textContent = `+${extraPhotos} Photos`;

  wrapper.append(thumb, text);
  column.append(wrapper);

  return column;
}

function renderThumbs(images, title) {
  const thumbs = images.slice(0, 3);
  const extraPhotos = images.length > 3 ? images.length - 2 : 0;

  return thumbs.map((image, index) => {
    if (index === 2 && extraPhotos > 0) {
      return renderMorePhotosThumb(image, extraPhotos);
    }

    return renderPhotoThumb(image, title);
  });
}

function renderSeller(listing) {
  const sellerName = listing.seller?.name || "Unknown seller";
  const sellerAvatar = listing.seller?.avatar?.url;
  const sellerBox = document.createElement("section");
  const title = document.createElement("h2");
  const card = document.createElement("div");
  const avatar = document.createElement("div");
  const name = document.createElement("p");
  const link = document.createElement("a");

  sellerBox.className = "seller-box";
  sellerBox.setAttribute("aria-labelledby", "seller-title");

  title.className = "seller-box__title";
  title.id = "seller-title";
  title.textContent = "Seller:";

  card.className = "seller-card d-flex align-items-center";
  avatar.className =
    "seller-card__avatar d-flex align-items-center justify-content-center rounded-circle";
  name.className = "seller-card__name ms-3";
  name.textContent = sellerName;
  link.className = "seller-card__button btn ms-auto";
  link.href = "profile.html";
  link.textContent = "View profile";

  avatar.append(renderAvatar(sellerAvatar, sellerName, "seller-card"));
  card.append(avatar, name, link);
  sellerBox.append(title, card);

  return sellerBox;
}

function renderOwnerActions(listing) {
  const actions = document.createElement("div");
  const editLink = document.createElement("a");
  const deleteButton = document.createElement("button");

  actions.className = "listing-actions d-flex gap-2 mb-3";
  editLink.className = "listing-actions__button btn";
  editLink.href = `edit-listing.html?id=${encodeURIComponent(listing.id)}`;
  editLink.textContent = "Edit";

  deleteButton.className = "listing-actions__button listing-actions__button--danger btn";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    handleDeleteClick(listing, deleteButton);
  });

  actions.append(editLink, deleteButton);
  return actions;
}

function renderTitleArea(listing) {
  const wrapper = document.createElement("div");
  const title = document.createElement("h1");

  wrapper.className = "listing-page__top";
  title.className = "listing-page__title";
  title.textContent = listing.title;
  wrapper.append(title);

  if (isOwner(listing)) {
    wrapper.append(renderOwnerActions(listing));
  }

  return wrapper;
}

function renderBidHistory(bids) {
  const list = document.createElement("div");
  list.className = "bid-history__list d-grid";

  if (!bids || bids.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "bid-history__empty";
    emptyMessage.textContent = "No bids yet.";
    list.append(emptyMessage);
    return list;
  }

  bids
    .slice()
    .reverse()
    .slice(0, 4)
    .forEach((bid) => {
      const bidderName = bid.bidder?.name || "Bidder";
      const item = document.createElement("article");
      const avatar = document.createElement("div");
      const text = document.createElement("div");
      const name = document.createElement("p");
      const bidAmount = document.createElement("p");
      const link = document.createElement("a");

      item.className = "bid-history__item d-flex align-items-center";
      avatar.className =
        "bid-history__avatar d-flex align-items-center justify-content-center rounded-circle";
      text.className = "bid-history__text ms-3";
      name.className = "bid-history__name";
      bidAmount.className = "bid-history__amount";
      link.className = "bid-history__button btn ms-auto";

      name.textContent = bidderName;
      bidAmount.textContent = formatCurrency(bid.amount);
      link.href = "profile.html";
      link.textContent = "View profile";

      avatar.append(renderAvatar(bid.bidder?.avatar?.url, bidderName, "bid-history"));
      text.append(name, bidAmount);
      item.append(avatar, text, link);
      list.append(item);
    });

  return list;
}

function renderMainContent(listing) {
  const images = getImages(listing);
  const mainImage = images[0];
  const main = document.createElement("div");
  const image = document.createElement("img");
  const thumbs = document.createElement("div");
  const overview = document.createElement("section");
  const overviewTitle = document.createElement("h2");
  const description = document.createElement("p");

  main.className = "listing-detail__main col-12 col-xl-8";
  image.className = "listing-detail__image w-100";
  thumbs.className = "listing-detail__thumbs row row-cols-1 row-cols-md-3 g-3 mx-3 my-4";
  overview.className = "listing-overview";
  overviewTitle.className = "listing-overview__title";
  description.className = "listing-overview__text";

  image.src = mainImage.url || fallbackImage;
  image.alt = mainImage.alt || listing.title;
  thumbs.setAttribute("aria-label", "Listing photos");
  overview.setAttribute("aria-labelledby", "overview-title");
  overviewTitle.id = "overview-title";
  overviewTitle.textContent = "Overview";
  description.textContent = listing.description || "No description added yet.";

  thumbs.append(...renderThumbs(images, listing.title));
  overview.append(overviewTitle, description);
  main.append(renderTitleArea(listing), image, thumbs, overview, renderSeller(listing));

  return main;
}

function renderBidPanel(listing) {
  const currentBid = getCurrentBid(listing);
  const nextBid = currentBid + 1;
  const blockMessage = getBidBlockMessage(listing);
  const aside = document.createElement("aside");
  const timeSection = document.createElement("div");
  const timeLabel = document.createElement("h2");
  const timeValue = document.createElement("p");
  const bidSection = document.createElement("div");
  const bidLabel = document.createElement("h2");
  const bidValue = document.createElement("p");
  const form = document.createElement("form");
  const label = document.createElement("label");
  const field = document.createElement("div");
  const currency = document.createElement("span");
  const input = document.createElement("input");
  const button = document.createElement("button");
  const history = document.createElement("section");
  const historyTitle = document.createElement("h2");

  aside.className = "bid-panel col-12 col-xl-4 text-center";
  aside.setAttribute("aria-label", "Bid panel");

  timeSection.className = "bid-panel__section";
  timeLabel.className = "bid-panel__label";
  timeValue.className = "bid-panel__time";
  bidSection.className = "bid-panel__section";
  bidLabel.className = "bid-panel__label";
  bidValue.className = "bid-panel__price";
  form.className = "bid-form";
  field.className =
    "bid-form__field d-flex align-items-center justify-content-center mx-auto mb-3";
  currency.className = "bid-form__currency";
  input.className = "bid-form__input";
  button.className = "bid-form__button btn";
  history.className = "bid-history";
  historyTitle.className = "bid-history__title";

  timeLabel.textContent = "Time Left";
  timeValue.textContent = formatTimeLeft(listing.endsAt);
  bidLabel.textContent = "Current Bid";
  bidValue.textContent = `${formatCurrency(currentBid)} USD`;
  label.textContent = "Bid amount";
  currency.textContent = "$";
  button.textContent = "Place Bid";
  historyTitle.textContent = "Bid History";

  label.className = "visually-hidden";
  label.htmlFor = "bid-amount";
  input.id = "bid-amount";
  input.name = "bidAmount";
  input.type = "number";
  input.min = String(nextBid);
  input.step = "1";
  input.placeholder = String(nextBid);
  input.required = true;
  button.type = "submit";
  button.dataset.bidButton = "true";
  form.dataset.bidForm = "true";

  if (blockMessage) {
    const formMessage = document.createElement("p");

    input.disabled = true;
    button.disabled = true;
    formMessage.className = "bid-form__message";
    formMessage.textContent = blockMessage;
    form.append(formMessage);
  }

  history.setAttribute("aria-labelledby", "bid-history-title");
  historyTitle.id = "bid-history-title";

  timeSection.append(timeLabel, timeValue);
  bidSection.append(bidLabel, bidValue);
  field.append(currency, input);
  form.prepend(label, field, button);
  history.append(historyTitle, renderBidHistory(listing.bids));
  aside.append(timeSection, bidSection, form, history);

  return aside;
}

function renderListingDetail(listing) {
  const detail = document.createDocumentFragment();

  document.title = `${listing.title} | Bidsy`;
  detail.append(renderMainContent(listing), renderBidPanel(listing));

  return detail;
}

function getListingId() {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get("id");
}

function getBidBlockMessage(listing) {
  if (!isLoggedIn()) {
    return "Please log in before placing a bid.";
  }

  if (isOwner(listing)) {
    return "You cannot bid on your own listing.";
  }

  if (new Date(listing.endsAt) <= new Date()) {
    return "This auction has ended.";
  }

  return "";
}

function getBidErrorMessage(form, listing) {
  const amount = Number(form.elements.bidAmount.value);
  const minimumBid = getCurrentBid(listing) + 1;

  if (!Number.isInteger(amount)) {
    return "Please use a whole number for your bid.";
  }

  if (amount < minimumBid) {
    return `Your bid must be at least ${formatCurrency(minimumBid)}.`;
  }

  return "";
}

async function refreshLoggedInUser() {
  const user = getUser();

  if (!user) {
    return;
  }

  try {
    const profile = await getProfile(user.name);
    saveUser({ ...user, ...profile });
    setupNavbar();
  } catch {
    return;
  }
}

function setupBidForm(listing, detailContainer, listingId) {
  const form = detailContainer.querySelector("[data-bid-form]");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage(messageSelector);

    const blockMessage = getBidBlockMessage(listing);

    if (blockMessage) {
      showMessage(blockMessage, "error", messageSelector);
      return;
    }

    const errorMessage = getBidErrorMessage(form, listing);

    if (errorMessage) {
      showMessage(errorMessage, "error", messageSelector);
      return;
    }

    const amount = Number(form.elements.bidAmount.value);
    const button = form.querySelector("[data-bid-button]");
    button.disabled = true;
    button.textContent = "Placing...";

    try {
      await createBid(listingId, amount);
      await refreshLoggedInUser();
      await loadListing(detailContainer, listingId, "Bid placed.");
    } catch (error) {
      button.disabled = false;
      button.textContent = "Place Bid";
      showMessage(error.message, "error", messageSelector);
    }
  });
}

async function loadListing(detailContainer, listingId, successMessage = "") {
  showMessage("Loading auction...", "info", messageSelector);

  try {
    const listing = await getListing(listingId);

    if (!listing) {
      detailContainer.replaceChildren();
      showMessage("Auction was not found.", "error", messageSelector);
      return;
    }

    detailContainer.replaceChildren(renderListingDetail(listing));
    setupBidForm(listing, detailContainer, listingId);

    if (successMessage) {
      showMessage(successMessage, "success", messageSelector);
    } else {
      clearMessage(messageSelector);
    }
  } catch (error) {
    detailContainer.replaceChildren();
    showMessage(error.message, "error", messageSelector);
  }
}

export async function setupListingDetailPage() {
  const detailContainer = document.querySelector("[data-listing-detail]");

  if (!detailContainer) {
    return;
  }

  const listingId = getListingId();

  if (!listingId) {
    detailContainer.replaceChildren();
    showMessage("Open an auction from the listings page.", "info", messageSelector);
    return;
  }

  await loadListing(detailContainer, listingId);
}
