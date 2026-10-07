const TOKEN_KEY = "mm_admin_token";

export function getAdminToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setAdminSession(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = "mm_admin=1; path=/; max-age=604800; SameSite=Lax";
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = "mm_admin=; path=/; max-age=0; SameSite=Lax";
}

export function adminFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = getAdminToken();
  if (token) headers.set("Authorization", `Token ${token}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(input, { ...init, headers });
}
