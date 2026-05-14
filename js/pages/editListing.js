import { getListing, updateListing } from "../api/listings.js";
import { clearMessage, showMessage } from "../ui/showMessage.js";
import { requireAuth } from "../utils/authGuard.js";
import { getUser } from "../utils/storage.js";

const messageSelector = "[data-edit-listing-message]";
const fallbackImage =
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80";

function getListingId() {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get("id");
}

function isOwner(listing) {
  const user = getUser();

  return Boolean(user && listing.seller?.name === user.name);
}

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function getTags(tagsText) {
  if (!tagsText) {
    return [];
  }

  return tagsText
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function getImageUrl(listing) {
  return listing.media?.[0]?.url || "";
}

function fillForm(form, listing) {
  const imageUrl = getImageUrl(listing);
  const mainImage = document.querySelector("[data-edit-listing-image]");
  const thumbs = document.querySelectorAll("[data-edit-listing-thumb]");
  const cancelLink = document.querySelector("[data-edit-listing-cancel]");

  form.title.value = listing.title || "";
  form.description.value = listing.description || "";
  form.tags.value = (listing.tags || []).join(", ");
  form.imageUrl.value = imageUrl;

  if (mainImage) {
    mainImage.src = imageUrl || fallbackImage;
    mainImage.alt = listing.title || "Listing image";
  }

  thumbs.forEach((thumb) => {
    thumb.src = imageUrl || fallbackImage;
    thumb.alt = listing.title || "Listing image";
  });

  if (cancelLink) {
    cancelLink.href = `listing.html?id=${encodeURIComponent(listing.id)}`;
  }
}

function getFormData(form) {
  const title = form.title.value.trim();
  const description = form.description.value.trim();
  const tags = getTags(form.tags.value.trim());
  const imageUrl = form.imageUrl.value.trim();
  const listingData = {
    title,
    description,
    tags,
  };

  if (imageUrl) {
    listingData.media = [
      {
        url: imageUrl,
        alt: title,
      },
    ];
  } else {
    listingData.media = [];
  }

  return listingData;
}

function validateForm(form) {
  const title = form.title.value.trim();
  const imageUrl = form.imageUrl.value.trim();

  if (!title) {
    return "Please add a listing title.";
  }

  if (imageUrl && !isValidUrl(imageUrl)) {
    return "Please use a valid image URL.";
  }

  return "";
}

export async function setupEditListingPage() {
  if (!requireAuth()) {
    return;
  }

  const form = document.querySelector("[data-edit-listing-form]");
  const listingId = getListingId();

  if (!form) {
    return;
  }

  if (!listingId) {
    form.classList.add("is-hidden");
    showMessage("Open a listing before editing it.", "error", messageSelector);
    return;
  }

  try {
    showMessage("Loading listing...", "info", messageSelector);

    const listing = await getListing(listingId);

    if (!isOwner(listing)) {
      form.classList.add("is-hidden");
      showMessage("You can only edit your own listings.", "error", messageSelector);
      return;
    }

    document.title = `Edit ${listing.title} | Bidsy`;
    fillForm(form, listing);
    clearMessage(messageSelector);
  } catch (error) {
    form.classList.add("is-hidden");
    showMessage(error.message, "error", messageSelector);
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage(messageSelector);

    const errorMessage = validateForm(form);

    if (errorMessage) {
      showMessage(errorMessage, "error", messageSelector);
      return;
    }

    const button = form.querySelector("[data-edit-listing-button]");
    button.disabled = true;
    button.textContent = "Saving...";

    try {
      await updateListing(listingId, getFormData(form));
      showMessage("Listing updated.", "success", messageSelector);

      setTimeout(() => {
        window.location.href = `listing.html?id=${encodeURIComponent(listingId)}`;
      }, 800);
    } catch (error) {
      showMessage(error.message, "error", messageSelector);
      button.disabled = false;
      button.textContent = "Save Changes";
    }
  });
}
