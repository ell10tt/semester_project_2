import { createListing } from "../api/listings.js";
import { clearMessage, showMessage } from "../ui/showMessage.js";

const messageSelector = "[data-create-listing-message]";

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

function getListingData(form) {
  const formData = new FormData(form);
  const title = formData.get("title").trim();
  const description = formData.get("description").trim();
  const tagsText = formData.get("tags").trim();
  const imageUrl = formData.get("imageUrl").trim();
  const endsAt = formData.get("endsAt");
  const listingData = {
    title,
    description,
    tags: getTags(tagsText),
    endsAt: new Date(endsAt).toISOString(),
  };

  if (imageUrl) {
    listingData.media = [
      {
        url: imageUrl,
        alt: title,
      },
    ];
  }

  return listingData;
}

function validateListingForm(form) {
  const formData = new FormData(form);
  const title = formData.get("title").trim();
  const endsAt = formData.get("endsAt");
  const imageUrl = formData.get("imageUrl").trim();

  if (!title) {
    return "Please add a listing title.";
  }

  if (!endsAt) {
    return "Please choose an auction end date.";
  }

  if (new Date(endsAt) <= new Date()) {
    return "Auction end date must be in the future.";
  }

  if (imageUrl && !isValidUrl(imageUrl)) {
    return "Please use a valid image URL.";
  }

  return "";
}

export function setupCreateListingForm() {
  const form = document.querySelector("[data-create-listing-form]");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage(messageSelector);

    const errorMessage = validateListingForm(form);

    if (errorMessage) {
      showMessage(errorMessage, "error", messageSelector);
      return;
    }

    const submitButton = form.querySelector("[data-create-listing-button]");
    submitButton.disabled = true;
    submitButton.textContent = "Creating...";

    try {
      const listing = await createListing(getListingData(form));
      showMessage("Listing created successfully.", "success", messageSelector);

      setTimeout(() => {
        window.location.href = `listing.html?id=${encodeURIComponent(listing.id)}`;
      }, 800);
    } catch (error) {
      showMessage(error.message, "error", messageSelector);
      submitButton.disabled = false;
      submitButton.textContent = "Complete";
    }
  });
}
