import { getListing } from "../api/listings.js";
import { clearMessage, showMessage } from "../ui/showMessage.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import { formatTimeLeft } from "../utils/formatDate.js";

const fallbackImage =
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80";
const messageSelector = "[data-listing-message]";

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

function getImages(listing) {
  if (listing.media && listing.media.length > 0) {
    return listing.media;
  }

  return [{ url: fallbackImage, alt: listing.title }];
}

function getCurrentBid(listing) {
  if (!listing.bids || listing.bids.length === 0) {
    return 0;
  }

  return Math.max(...listing.bids.map((bid) => bid.amount));
}

function renderAvatar(avatarUrl, name, className) {
  if (avatarUrl) {
    const image = makeElement("img", `${className}__avatar-image`);
    image.src = avatarUrl;
    image.alt = name;

    return image;
  }

  return makeElement("i", "bi bi-person-fill");
}

function renderPhotoThumb(image, title) {
  const column = makeElement("div", "col");
  const thumb = makeElement("img", "listing-detail__thumb w-100");

  thumb.src = image.url || fallbackImage;
  thumb.alt = image.alt || title;

  column.append(thumb);
  return column;
}

function renderMorePhotosThumb(image, extraPhotos) {
  const column = makeElement("div", "col");
  const wrapper = makeElement(
    "div",
    "listing-detail__more position-relative overflow-hidden"
  );
  const thumb = makeElement("img", "listing-detail__thumb w-100");
  const text = makeElement(
    "span",
    "listing-detail__more-text position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center",
    `+${extraPhotos} Photos`
  );

  thumb.src = image.url || fallbackImage;
  thumb.alt = "";

  wrapper.append(thumb, text);
  column.append(wrapper);

  return column;
}

function renderThumbs(images, title) {
  const thumbs = images.slice(0, 3);
  const extraPhotos = images.length > 3 ? images.length - 2 : 0;

  return thumbs.map((image, index) => {
    if (index === 2 && extraPhotos > 0) {
      return renderMorePhotosThumb(image, extraPhotos);
    }

    return renderPhotoThumb(image, title);
  });
}

function renderSeller(listing) {
  const sellerName = listing.seller?.name || "Unknown seller";
  const sellerAvatar = listing.seller?.avatar?.url;
  const sellerBox = makeElement("section", "seller-box");
  const title = makeElement("h2", "seller-box__title", "Seller:");
  const card = makeElement("div", "seller-card d-flex align-items-center");
  const avatar = makeElement(
    "div",
    "seller-card__avatar d-flex align-items-center justify-content-center rounded-circle"
  );
  const name = makeElement("p", "seller-card__name ms-3", sellerName);
  const link = makeElement("a", "seller-card__button btn ms-auto", "View profile");

  sellerBox.setAttribute("aria-labelledby", "seller-title");
  title.id = "seller-title";
  link.href = "profile.html";

  avatar.append(renderAvatar(sellerAvatar, sellerName, "seller-card"));
  card.append(avatar, name, link);
  sellerBox.append(title, card);

  return sellerBox;
}

function renderBidHistory(bids) {
  const list = makeElement("div", "bid-history__list d-grid");

  if (!bids || bids.length === 0) {
    list.append(makeElement("p", "bid-history__empty", "No bids yet."));
    return list;
  }

  bids
    .slice()
    .reverse()
    .slice(0, 4)
    .forEach((bid) => {
      const bidderName = bid.bidder?.name || "Bidder";
      const amount = formatCurrency(bid.amount);
      const item = makeElement("article", "bid-history__item d-flex align-items-center");
      const avatar = makeElement(
        "div",
        "bid-history__avatar d-flex align-items-center justify-content-center rounded-circle"
      );
      const text = makeElement("div", "bid-history__text ms-3");
      const name = makeElement("p", "bid-history__name", bidderName);
      const bidAmount = makeElement("p", "bid-history__amount", amount);
      const link = makeElement("a", "bid-history__button btn ms-auto", "View profile");

      link.href = "profile.html";

      avatar.append(renderAvatar(bid.bidder?.avatar?.url, bidderName, "bid-history"));
      text.append(name, bidAmount);
      item.append(avatar, text, link);
      list.append(item);
    });

  return list;
}

function renderMainContent(listing) {
  const images = getImages(listing);
  const mainImage = images[0];
  const main = makeElement("div", "listing-detail__main col");
  const title = makeElement("h1", "listing-page__title", listing.title);
  const image = makeElement("img", "listing-detail__image w-100");
  const thumbs = makeElement(
    "div",
    "listing-detail__thumbs row row-cols-3 g-3 mx-3 my-4"
  );
  const overview = makeElement("section", "listing-overview");
  const overviewTitle = makeElement("h2", "listing-overview__title", "Overview");
  const description = makeElement(
    "p",
    "listing-overview__text",
    listing.description || "No description added yet."
  );

  image.src = mainImage.url || fallbackImage;
  image.alt = mainImage.alt || listing.title;

  thumbs.setAttribute("aria-label", "Listing photos");
  thumbs.append(...renderThumbs(images, listing.title));

  overview.setAttribute("aria-labelledby", "overview-title");
  overviewTitle.id = "overview-title";
  overview.append(overviewTitle, description);
  main.append(title, image, thumbs, overview, renderSeller(listing));

  return main;
}

function renderBidPanel(listing) {
  const currentBid = getCurrentBid(listing);
  const nextBid = currentBid + 1;
  const aside = makeElement("aside", "bid-panel col-4 text-center");
  const timeSection = makeElement("div", "bid-panel__section");
  const timeLabel = makeElement("h2", "bid-panel__label", "Time Left");
  const timeValue = makeElement("p", "bid-panel__time", formatTimeLeft(listing.endsAt));
  const bidSection = makeElement("div", "bid-panel__section");
  const bidLabel = makeElement("h2", "bid-panel__label", "Current Bid");
  const bidValue = makeElement(
    "p",
    "bid-panel__price",
    `${formatCurrency(currentBid)} USD`
  );
  const form = makeElement("form", "bid-form");
  const label = makeElement("label", "visually-hidden", "Bid amount");
  const field = makeElement(
    "div",
    "bid-form__field d-flex align-items-center justify-content-center mx-auto mb-3"
  );
  const currency = makeElement("span", "bid-form__currency", "$");
  const input = makeElement("input", "bid-form__input");
  const button = makeElement("button", "bid-form__button btn", "Place Bid");
  const history = makeElement("section", "bid-history");
  const historyTitle = makeElement("h2", "bid-history__title", "Bid History");

  aside.setAttribute("aria-label", "Bid panel");

  label.htmlFor = "bid-amount";
  input.id = "bid-amount";
  input.name = "bidAmount";
  input.type = "number";
  input.min = String(nextBid);
  input.placeholder = String(nextBid);
  button.type = "submit";

  history.setAttribute("aria-labelledby", "bid-history-title");
  historyTitle.id = "bid-history-title";

  timeSection.append(timeLabel, timeValue);
  bidSection.append(bidLabel, bidValue);
  field.append(currency, input);
  form.append(label, field, button);
  history.append(historyTitle, renderBidHistory(listing.bids));
  aside.append(timeSection, bidSection, form, history);

  return aside;
}

function renderListingDetail(listing) {
  const detail = document.createDocumentFragment();

  document.title = `${listing.title} | Bidsy`;
  detail.append(renderMainContent(listing), renderBidPanel(listing));

  return detail;
}

function getListingId() {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get("id");
}

export async function setupListingDetailPage() {
  const detailContainer = document.querySelector("[data-listing-detail]");

  if (!detailContainer) {
    return;
  }

  const listingId = getListingId();

  if (!listingId) {
    detailContainer.replaceChildren();
    showMessage("Open an auction from the listings page.", "info", messageSelector);
    return;
  }

  showMessage("Loading auction...", "info", messageSelector);

  try {
    const listing = await getListing(listingId);

    if (!listing) {
      detailContainer.replaceChildren();
      showMessage("Auction was not found.", "error", messageSelector);
      return;
    }

    clearMessage(messageSelector);
    detailContainer.replaceChildren(renderListingDetail(listing));
  } catch (error) {
    detailContainer.replaceChildren();
    showMessage(error.message, "error", messageSelector);
  }
}
