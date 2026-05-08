import { setupCreateListingForm } from "../events/listingEvents.js";
import { requireAuth } from "../utils/authGuard.js";

export function setupCreateListingPage() {
  if (!requireAuth()) {
    return;
  }

  setupCreateListingForm();
}
