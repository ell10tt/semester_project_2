import { getProfile, updateProfile } from "../api/profiles.js";
import { clearMessage, showMessage } from "../ui/showMessage.js";
import { setupNavbar } from "../ui/updateNavbar.js";
import { requireAuth } from "../utils/authGuard.js";
import { getUser, saveUser } from "../utils/storage.js";

const messageSelector = "[data-edit-profile-message]";

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function showAvatar(url, alt) {
  const avatarBox = document.querySelector("[data-edit-profile-avatar]");

  if (!avatarBox) {
    return;
  }

  avatarBox.replaceChildren();

  if (url) {
    const avatarImage = document.createElement("img");
    avatarImage.className = "edit-profile-header__avatar-image";
    avatarImage.src = url;
    avatarImage.alt = alt || "Profile avatar";
    avatarBox.append(avatarImage);
    return;
  }

  const icon = document.createElement("i");
  icon.className = "bi bi-person-fill";
  avatarBox.append(icon);
}

function fillForm(form, profile) {
  const avatarUrl = profile.avatar?.url || "";
  const avatarAlt = profile.avatar?.alt || "";
  const bannerUrl = profile.banner?.url || "";
  const bannerAlt = profile.banner?.alt || "";
  const nameElement = document.querySelector("[data-edit-profile-name]");
  const emailElement = document.querySelector("[data-edit-profile-email]");
  const creditsElement = document.querySelector("[data-edit-profile-credits]");

  form.elements.bio.value = profile.bio || "";
  form.elements.avatarUrl.value = avatarUrl;
  form.elements.avatarAlt.value = avatarAlt;
  form.elements.bannerUrl.value = bannerUrl;
  form.elements.bannerAlt.value = bannerAlt;

  if (nameElement) {
    nameElement.textContent = profile.name || "Profile";
  }

  if (emailElement) {
    emailElement.textContent = profile.email || "";
  }

  if (creditsElement) {
    creditsElement.textContent = `Credits: ${profile.credits ?? 0}`;
  }

  showAvatar(avatarUrl, avatarAlt);
}

function getProfileData(form) {
  const profileData = {
    bio: form.elements.bio.value.trim(),
  };
  const avatarUrl = form.elements.avatarUrl.value.trim();
  const avatarAlt = form.elements.avatarAlt.value.trim();
  const bannerUrl = form.elements.bannerUrl.value.trim();
  const bannerAlt = form.elements.bannerAlt.value.trim();

  if (avatarUrl) {
    profileData.avatar = {
      url: avatarUrl,
      alt: avatarAlt || "Profile avatar",
    };
  }

  if (bannerUrl) {
    profileData.banner = {
      url: bannerUrl,
      alt: bannerAlt || "Profile banner",
    };
  }

  return profileData;
}

function validateForm(form) {
  const avatarUrl = form.elements.avatarUrl.value.trim();
  const bannerUrl = form.elements.bannerUrl.value.trim();

  if (avatarUrl && !isValidUrl(avatarUrl)) {
    return "Please use a valid avatar URL.";
  }

  if (bannerUrl && !isValidUrl(bannerUrl)) {
    return "Please use a valid banner URL.";
  }

  return "";
}

export async function setupEditProfilePage() {
  if (!requireAuth()) {
    return;
  }

  const form = document.querySelector("[data-edit-profile-form]");
  const user = getUser();

  if (!form || !user) {
    return;
  }

  try {
    showMessage("Loading profile...", "info", messageSelector);
    const profile = await getProfile(user.name);
    fillForm(form, profile);
    clearMessage(messageSelector);
  } catch (error) {
    showMessage(error.message, "error", messageSelector);
  }

  form.addEventListener("input", () => {
    const avatarUrl = form.elements.avatarUrl.value.trim();
    const avatarAlt = form.elements.avatarAlt.value.trim();

    if (!avatarUrl || isValidUrl(avatarUrl)) {
      showAvatar(avatarUrl, avatarAlt);
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage(messageSelector);

    const errorMessage = validateForm(form);

    if (errorMessage) {
      showMessage(errorMessage, "error", messageSelector);
      return;
    }

    const button = form.querySelector("[data-edit-profile-button]");
    button.disabled = true;
    button.textContent = "Saving...";

    try {
      const updatedProfile = await updateProfile(user.name, getProfileData(form));
      saveUser({ ...user, ...updatedProfile });
      setupNavbar();
      showMessage("Profile updated.", "success", messageSelector);

      setTimeout(() => {
        window.location.href = "profile.html";
      }, 800);
    } catch (error) {
      button.disabled = false;
      button.textContent = "Confirm";
      showMessage(error.message, "error", messageSelector);
    }
  });
}
