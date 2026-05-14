import { apiRequest } from "./httpClient.js";
import { clearAuthData, saveToken, saveUser } from "../utils/storage.js";

export async function registerUser(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: userData,
  });
}

export async function loginUser(email, password) {
  const user = await apiRequest("/auth/login", {
    method: "POST",
    body: {
      email,
      password,
    },
  });

  saveToken(user.accessToken);

  const userInfo = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    banner: user.banner,
    credits: user.credits,
  };

  saveUser(userInfo);

  return user;
}

export function logoutUser() {
  clearAuthData();
}
