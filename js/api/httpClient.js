import { apiBaseUrl, apiKey } from "../config.js";
import { getToken } from "../utils/storage.js";

function makeUrl(endpoint) {
  return `${apiBaseUrl}${endpoint}`;
}

function getErrorMessage(errorData) {
  if (errorData.errors && errorData.errors.length > 0) {
    return errorData.errors.map((error) => error.message).join(", ");
  }

  return "Something went wrong. Please try again.";
}

export async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (apiKey) {
    headers["X-Noroff-API-Key"] = apiKey;
  }

  const requestOptions = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body !== "string") {
    requestOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(makeUrl(endpoint), requestOptions);

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data.data;
}
