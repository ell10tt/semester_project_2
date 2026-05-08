import { apiRequest } from "./httpClient.js";

export function getListings(options = 12) {
  const settings = typeof options === "number" ? { limit: options } : options;
  const params = new URLSearchParams({
    _active: "true",
    _seller: "true",
    _bids: "true",
    sort: settings.sort || "created",
    sortOrder: settings.sortOrder || "desc",
    limit: String(settings.limit || 12),
    page: String(settings.page || 1),
  });

  if (settings.tag) {
    params.set("_tag", settings.tag);
  }

  return apiRequest(`/auction/listings?${params.toString()}`);
}

export function getListing(id) {
  return apiRequest(
    `/auction/listings/${encodeURIComponent(id)}?_seller=true&_bids=true`
  );
}

export function createListing(listingData) {
  return apiRequest("/auction/listings", {
    method: "POST",
    body: listingData,
  });
}

export function updateListing(id, listingData) {
  return apiRequest(`/auction/listings/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: listingData,
  });
}

export function deleteListing(id) {
  return apiRequest(`/auction/listings/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
