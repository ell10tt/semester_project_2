function renderAvatar(profile) {
  const avatarElement = document.querySelector("[data-profile-avatar]");

  if (!avatarElement) {
    return;
  }

  if (profile.avatar?.url) {
    const image = document.createElement("img");
    image.className = "profile-header__avatar-image";
    image.src = profile.avatar.url;
    image.alt = profile.avatar.alt || profile.name;

    avatarElement.replaceChildren(image);
    return;
  }

  const icon = document.createElement("i");
  icon.className = "bi bi-person-fill";
  avatarElement.replaceChildren(icon);
}

export function renderProfile(profile) {
  const nameElement = document.querySelector("[data-profile-name]");
  const creditsElement = document.querySelector("[data-profile-credits]");

  if (nameElement) {
    nameElement.textContent = profile.name;
  }

  if (creditsElement) {
    creditsElement.textContent = `Credits: ${profile.credits || 0}`;
  }

  renderAvatar(profile);
}
