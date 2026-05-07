import { apiRequest } from "./httpClient.js";

export function getListings(limit = 12) {
  return apiRequest(
    `/auction/listings?_active=true&_seller=true&_bids=true&limit=${limit}`
  );
}

export function getListing(id) {
  return apiRequest(
    `/auction/listings/${encodeURIComponent(id)}?_seller=true&_bids=true`
  );
}
