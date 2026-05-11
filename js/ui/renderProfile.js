import { renderListingCard } from "./renderListingCard.js";

const defaultBanner =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1500&q=80";

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
  const column = document.createElement("div");
  const text = document.createElement("p");

  column.className = "col-12";
  text.className = "profile-items__empty";
  text.textContent = message;
  column.append(text);

  container.replaceChildren(column);
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
  const nameElement = document.querySelector("[data-profile-name]");
  const emailElement = document.querySelector("[data-profile-email]");
  const creditsElement = document.querySelector("[data-profile-credits]");
  const bioElement = document.querySelector("[data-profile-bio]");
  const listingCountElement = document.querySelector("[data-profile-listing-count]");
  const bidCountElement = document.querySelector("[data-profile-bid-count]");
  const winCountElement = document.querySelector("[data-profile-win-count]");

  if (nameElement) {
    nameElement.textContent = profile.name;
  }

  if (emailElement) {
    emailElement.textContent = profile.email || "";
  }

  if (creditsElement) {
    creditsElement.textContent = `Credits: ${profile.credits || 0}`;
  }

  if (bioElement) {
    bioElement.textContent = profile.bio || "No bio yet.";
  }

  if (listingCountElement) {
    listingCountElement.textContent = String(listings.length);
  }

  if (bidCountElement) {
    bidCountElement.textContent = String(bids.length);
  }

  if (winCountElement) {
    winCountElement.textContent = String(wins.length);
  }

  renderBanner(profile);
  renderAvatar(profile);
  renderListings("[data-profile-listings]", listings, "No listings created yet.");
  renderListings("[data-profile-bids]", bidListings, "No bids placed yet.");
  renderListings("[data-profile-wins]", wins, "No wins yet.");
}
