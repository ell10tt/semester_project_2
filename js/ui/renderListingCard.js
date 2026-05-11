import { formatCurrency } from "../utils/formatCurrency.js";
import { formatTimeLeft } from "../utils/formatDate.js";

const fallbackImage =
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80";

function getImage(listing) {
  return listing.media?.[0]?.url || fallbackImage;
}

function getImageAlt(listing) {
  return listing.media?.[0]?.alt || listing.title;
}

function getCurrentBid(listing) {
  if (!listing.bids || listing.bids.length === 0) {
    return 0;
  }

  return Math.max(...listing.bids.map((bid) => bid.amount));
}

function getShortDescription(text) {
  const description = text || "No description added yet.";

  if (description.length <= 90) {
    return description;
  }

  return `${description.slice(0, 87)}...`;
}

export function renderListingCard(listing) {
  const column = document.createElement("div");
  const card = document.createElement("article");
  const imageLink = document.createElement("a");
  const image = document.createElement("img");
  const body = document.createElement("div");
  const header = document.createElement("div");
  const title = document.createElement("h2");
  const favoriteButton = document.createElement("button");
  const favoriteIcon = document.createElement("i");
  const description = document.createElement("p");
  const line = document.createElement("div");
  const meta = document.createElement("div");
  const bidText = document.createElement("p");
  const bidLabel = document.createElement("strong");
  const bidValue = document.createElement("span");
  const timeText = document.createElement("p");
  const timeLabel = document.createElement("strong");
  const timeValue = document.createElement("span");

  column.className = "col";
  card.className = "listing-card h-100";
  imageLink.className = "listing-card__image-link d-block";
  image.className = "listing-card__image w-100";
  body.className = "listing-card__body p-3";
  header.className =
    "listing-card__header d-flex align-items-center justify-content-between";
  title.className = "listing-card__title mb-0";
  favoriteButton.className = "listing-card__favorite";
  favoriteIcon.className = "bi bi-heart";
  description.className = "listing-card__text my-3";
  line.className = "listing-card__line";
  meta.className = "listing-card__meta d-flex justify-content-between mt-3";
  bidText.className = "mb-0";
  bidValue.className = "listing-card__price d-block";
  timeText.className = "mb-0";
  timeValue.className = "listing-card__time d-block";

  imageLink.href = `listing.html?id=${encodeURIComponent(listing.id)}`;
  image.src = getImage(listing);
  image.alt = getImageAlt(listing);
  title.textContent = listing.title;
  description.textContent = getShortDescription(listing.description);
  bidLabel.textContent = "Current Bid:";
  bidValue.textContent = formatCurrency(getCurrentBid(listing));
  timeLabel.textContent = "Time left:";
  timeValue.textContent = formatTimeLeft(listing.endsAt);

  favoriteButton.type = "button";
  favoriteButton.setAttribute("aria-label", "Add to favourites");

  favoriteButton.append(favoriteIcon);
  header.append(title, favoriteButton);
  bidText.append(bidLabel, bidValue);
  timeText.append(timeLabel, timeValue);
  meta.append(bidText, timeText);
  imageLink.append(image);
  body.append(header, description, line, meta);
  card.append(imageLink, body);
  column.append(card);

  return column;
}
