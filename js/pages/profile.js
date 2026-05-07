import { getProfile } from "../api/profiles.js";
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
    saveUser(profile);
    renderProfile(profile);
    setupNavbar();
  } catch (error) {
    showMessage(error.message);
  }
}
