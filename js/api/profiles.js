import { apiRequest } from "./httpClient.js";

export function getProfile(name) {
  return apiRequest(
    `/auction/profiles/${encodeURIComponent(name)}?_listings=true&_wins=true`
  );
}

export function getProfileBids(name) {
  return apiRequest(
    `/auction/profiles/${encodeURIComponent(name)}/bids?_listings=true&sort=created&sortOrder=desc`
  );
}

export function updateProfile(name, profileData) {
  return apiRequest(`/auction/profiles/${encodeURIComponent(name)}`, {
    method: "PUT",
    body: profileData,
  });
}
