import { formatCurrency } from "../utils/formatCurrency.js";
import { formatTimeLeft } from "../utils/formatDate.js";

const fallbackImage =
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80";

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}

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
  const column = makeElement("div", "col");
  const card = makeElement("article", "listing-card h-100");
  const imageLink = makeElement("a", "listing-card__image-link d-block");
  const image = makeElement("img", "listing-card__image w-100");
  const body = makeElement("div", "listing-card__body p-3");
  const header = makeElement(
    "div",
    "listing-card__header d-flex align-items-center justify-content-between"
  );
  const title = makeElement("h2", "listing-card__title mb-0", listing.title);
  const favoriteButton = makeElement("button", "listing-card__favorite");
  const favoriteIcon = makeElement("i", "bi bi-heart");
  const description = makeElement(
    "p",
    "listing-card__text my-3",
    getShortDescription(listing.description)
  );
  const line = makeElement("div", "listing-card__line");
  const meta = makeElement(
    "div",
    "listing-card__meta d-flex justify-content-between mt-3"
  );
  const bidText = makeElement("p", "mb-0");
  const bidLabel = makeElement("strong", "", "Current Bid:");
  const bidValue = makeElement(
    "span",
    "listing-card__price d-block",
    formatCurrency(getCurrentBid(listing))
  );
  const timeText = makeElement("p", "mb-0");
  const timeLabel = makeElement("strong", "", "Time left:");
  const timeValue = makeElement(
    "span",
    "listing-card__time d-block",
    formatTimeLeft(listing.endsAt)
  );

  imageLink.href = `listing.html?id=${encodeURIComponent(listing.id)}`;
  image.src = getImage(listing);
  image.alt = getImageAlt(listing);

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
