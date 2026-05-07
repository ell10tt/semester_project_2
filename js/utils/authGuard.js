import { isLoggedIn } from "./storage.js";

export function requireAuth() {
  if (isLoggedIn()) {
    return true;
  }

  window.location.href = "/login.html";
  return false;
}

export function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = "/profile.html";
    return true;
  }

  return false;
}
