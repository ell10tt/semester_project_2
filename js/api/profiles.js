import { apiRequest } from "./httpClient.js";

export function getProfile(name) {
  return apiRequest(
    `/auction/profiles/${encodeURIComponent(name)}?_listings=true&_wins=true`
  );
}
