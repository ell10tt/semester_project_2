import { getListings } from "../api/listings.js";
import { renderListingCard } from "../ui/renderListingCard.js";
import { clearMessage, showMessage } from "../ui/showMessage.js";

const messageSelector = "[data-home-message]";

export async function setupHomePage() {
  const listingsContainer = document.querySelector("[data-featured-listings]");

  if (!listingsContainer) {
    return;
  }

  showMessage("Loading featured auctions...", "info", messageSelector);

  try {
    const listings = await getListings(3);

    if (!listings || listings.length === 0) {
      listingsContainer.replaceChildren();
      showMessage("No featured auctions found.", "info", messageSelector);
      return;
    }

    clearMessage(messageSelector);
    listingsContainer.replaceChildren(...listings.map(renderListingCard));
  } catch (error) {
    listingsContainer.replaceChildren();
    showMessage(error.message, "error", messageSelector);
  }
}
