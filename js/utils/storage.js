const tokenKey = "bidsyToken";
const userKey = "bidsyUser";

export function saveToken(token) {
  localStorage.setItem(tokenKey, token);
}

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function saveUser(user) {
  localStorage.setItem(userKey, JSON.stringify(user));
}

export function getUser() {
  const user = localStorage.getItem(userKey);

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}

export function clearAuthData() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
}

export function isLoggedIn() {
  return Boolean(getToken());
}
