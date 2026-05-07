import { setupRegisterForm } from "../events/registerEvents.js";
import { redirectIfLoggedIn } from "../utils/authGuard.js";

export function setupRegisterPage() {
  if (redirectIfLoggedIn()) {
    return;
  }

  setupRegisterForm();
}
