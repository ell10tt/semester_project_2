import { getProfile, getProfileBids } from "../api/profiles.js";
import { renderProfile } from "../ui/renderProfile.js";
import { setupNavbar } from "../ui/updateNavbar.js";
import { getUser, saveUser } from "../utils/storage.js";
import { requireAuth } from "../utils/authGuard.js";
import { showMessage } from "../ui/showMessage.js";

export async function setupProfilePage() {
  if (!requireAuth()) {
    return;
  }

  const user = getUser();

  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  renderProfile(user);

  try {
    const profile = await getProfile(user.name);
    const bids = await getProfileBids(user.name);

    saveUser(profile);
    renderProfile(profile, bids || []);
    setupNavbar();
  } catch (error) {
    showMessage(error.message);
  }
}
