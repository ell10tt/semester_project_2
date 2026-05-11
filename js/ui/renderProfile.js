import { renderListingCard } from "./renderListingCard.js";

const defaultBanner =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1500&q=80";

function setText(selector, text) {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = text;
  }
}

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

function renderBanner(profile) {
  const bannerElement = document.querySelector("[data-profile-banner]");

  if (!bannerElement) {
    return;
  }

  const bannerUrl = profile.banner?.url || defaultBanner;
  bannerElement.style.backgroundImage = `url("${bannerUrl}")`;
}

function renderEmptyMessage(container, message) {
  const text = document.createElement("p");
  text.className = "profile-items__empty";
  text.textContent = message;

  container.replaceChildren(text);
}

function renderListings(selector, listings, emptyMessage) {
  const container = document.querySelector(selector);

  if (!container) {
    return;
  }

  if (!listings || listings.length === 0) {
    renderEmptyMessage(container, emptyMessage);
    return;
  }

  container.replaceChildren(...listings.map(renderListingCard));
}

function getListingsFromBids(bids) {
  const listings = [];
  const listingIds = new Set();

  bids.forEach((bid) => {
    const listing = bid.listing;

    if (!listing || listingIds.has(listing.id)) {
      return;
    }

    listingIds.add(listing.id);
    listings.push(listing);
  });

  return listings;
}

export function renderProfile(profile, bids = []) {
  const listings = profile.listings || [];
  const wins = profile.wins || [];
  const bidListings = getListingsFromBids(bids);

  setText("[data-profile-name]", profile.name);
  setText("[data-profile-email]", profile.email || "");
  setText("[data-profile-credits]", `Credits: ${profile.credits || 0}`);
  setText("[data-profile-bio]", profile.bio || "No bio yet.");
  setText("[data-profile-listing-count]", String(listings.length));
  setText("[data-profile-bid-count]", String(bids.length));
  setText("[data-profile-win-count]", String(wins.length));

  renderBanner(profile);
  renderAvatar(profile);
  renderListings("[data-profile-listings]", listings, "No listings created yet.");
  renderListings("[data-profile-bids]", bidListings, "No bids placed yet.");
  renderListings("[data-profile-wins]", wins, "No wins yet.");
}
