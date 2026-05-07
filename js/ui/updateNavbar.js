import { getUser, isLoggedIn } from "../utils/storage.js";
import { logoutUser } from "../api/auth.js";

function showElements(elements) {
  elements.forEach((element) => {
    element.classList.remove("is-hidden");
  });
}

function hideElements(elements) {
  elements.forEach((element) => {
    element.classList.add("is-hidden");
  });
}

export function setupNavbar() {
  const user = getUser();
  const loggedIn = isLoggedIn();
  const guestOnlyElements = document.querySelectorAll("[data-guest-only]");
  const authOnlyElements = document.querySelectorAll("[data-auth-only]");
  const creditsElements = document.querySelectorAll("[data-user-credits]");
  const logoutButtons = document.querySelectorAll("[data-logout-button]");

  if (loggedIn) {
    hideElements(guestOnlyElements);
    showElements(authOnlyElements);
  } else {
    showElements(guestOnlyElements);
    hideElements(authOnlyElements);
  }

  creditsElements.forEach((element) => {
    const credits = user?.credits ?? 0;
    element.textContent = `Credits: ${credits}`;
  });

  logoutButtons.forEach((button) => {
    button.onclick = () => {
      logoutUser();
      window.location.href = "/login.html";
    };
  });
}
