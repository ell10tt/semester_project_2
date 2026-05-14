import { getUser, isLoggedIn } from "../utils/storage.js";
import { logoutUser } from "../api/auth.js";

function showDefaultAvatar(element) {
  const icon = document.createElement("i");
  icon.className = "bi bi-person-fill";
  element.replaceChildren(icon);
}

function showNavbarAvatar(elements, user) {
  elements.forEach((element) => {
    const avatarUrl = user?.avatar?.url;

    if (!avatarUrl) {
      showDefaultAvatar(element);
      return;
    }

    const image = document.createElement("img");
    image.className = "site-nav__avatar-image";
    image.src = avatarUrl;
    image.alt = user.avatar.alt || user.name || "Profile avatar";
    image.addEventListener("error", () => showDefaultAvatar(element), { once: true });

    element.replaceChildren(image);
  });
}

export function setupNavbar() {
  const user = getUser();
  const loggedIn = isLoggedIn();
  const guestOnlyElements = document.querySelectorAll("[data-guest-only]");
  const authOnlyElements = document.querySelectorAll("[data-auth-only]");
  const creditsElements = document.querySelectorAll("[data-user-credits]");
  const avatarElements = document.querySelectorAll("[data-user-avatar]");
  const logoutButtons = document.querySelectorAll("[data-logout-button]");

  if (loggedIn) {
    guestOnlyElements.forEach((element) => element.classList.add("is-hidden"));
    authOnlyElements.forEach((element) => element.classList.remove("is-hidden"));
  } else {
    guestOnlyElements.forEach((element) => element.classList.remove("is-hidden"));
    authOnlyElements.forEach((element) => element.classList.add("is-hidden"));
  }

  creditsElements.forEach((element) => {
    const credits = user?.credits ?? 0;
    element.textContent = `Credits: ${credits}`;
  });

  showNavbarAvatar(avatarElements, user);

  logoutButtons.forEach((button) => {
    button.onclick = () => {
      logoutUser();
      window.location.href = "login.html";
    };
  });
}
