import { getProfile, getProfileBids } from "../api/profiles.js";
import { renderProfile } from "../ui/renderProfile.js";
import { setupNavbar } from "../ui/updateNavbar.js";
import { getUser, saveUser } from "../utils/storage.js";
import { requireAuth } from "../utils/authGuard.js";
import { showMessage } from "../ui/showMessage.js";

function showProfilePanel(tabName) {
  const tabs = document.querySelectorAll("[data-profile-tab]");
  const panels = document.querySelectorAll("[data-profile-panel]");

  tabs.forEach((tab) => {
    const isActive = tab.dataset.profileTab === tabName;

    tab.classList.toggle("profile-tabs__button--active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.profilePanel === tabName;

    panel.classList.toggle("is-hidden", !isActive);
  });
}

function setupProfileTabs() {
  const tabs = document.querySelectorAll("[data-profile-tab]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      showProfilePanel(tab.dataset.profileTab);
    });
  });
}

export async function setupProfilePage() {
  if (!requireAuth()) {
    return;
  }

  setupProfileTabs();

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
