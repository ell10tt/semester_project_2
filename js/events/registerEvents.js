import { registerUser } from "../api/auth.js";
import { clearMessage, showMessage } from "../ui/showMessage.js";

function isNoroffEmail(email) {
  return email.trim().toLowerCase().endsWith("@stud.noroff.no");
}

export function setupRegisterForm() {
  const form = document.querySelector("#register-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();

    const formData = new FormData(form);
    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const password = formData.get("password");

    if (!isNoroffEmail(email)) {
      showMessage("Email must end with @stud.noroff.no");
      return;
    }

    try {
      await registerUser({ name, email, password });
      form.reset();
      showMessage("Account created. You can log in now.", "success");
    } catch (error) {
      showMessage(error.message);
    }
  });
}
