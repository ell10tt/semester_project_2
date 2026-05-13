import { loginUser } from "../api/auth.js";
import { getProfile } from "../api/profiles.js";
import { saveUser } from "../utils/storage.js";
import { clearMessage, showMessage } from "../ui/showMessage.js";

export function setupLoginForm() {
  const form = document.querySelector("#login-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();

    const formData = new FormData(form);
    const email = formData.get("email")?.trim();
    const password = formData.get("password");
    const button = form.querySelector("button");

    button.disabled = true;
    button.textContent = "Logging in...";

    try {
      const user = await loginUser(email, password);
      const profile = await getProfile(user.name);

      saveUser(profile);

      showMessage("Logged in successfully.", "success");
      window.location.href = "/profile.html";
    } catch (error) {
      showMessage(error.message);
      button.disabled = false;
      button.textContent = "Login";
    }
  });
}
