import { apiRequest } from "./httpClient.js";

export function createBid(listingId, amount) {
  return apiRequest(`/auction/listings/${encodeURIComponent(listingId)}/bids`, {
    method: "POST",
    body: {
      amount,
    },
  });
}
