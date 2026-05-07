import { setupLoginForm } from "../events/loginEvents.js";
import { redirectIfLoggedIn } from "../utils/authGuard.js";

export function setupLoginPage() {
  if (redirectIfLoggedIn()) {
    return;
  }

  setupLoginForm();
}
