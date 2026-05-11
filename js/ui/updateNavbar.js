import { getUser, isLoggedIn } from "../utils/storage.js";
import { logoutUser } from "../api/auth.js";

export function setupNavbar() {
  const user = getUser();
  const loggedIn = isLoggedIn();
  const guestOnlyElements = document.querySelectorAll("[data-guest-only]");
  const authOnlyElements = document.querySelectorAll("[data-auth-only]");
  const creditsElements = document.querySelectorAll("[data-user-credits]");
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

  logoutButtons.forEach((button) => {
    button.onclick = () => {
      logoutUser();
      window.location.href = "/login.html";
    };
  });
}
