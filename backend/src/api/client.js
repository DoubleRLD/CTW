const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Reads the JWT saved at login. Keeping this in one function means
// if you ever swap localStorage for cookies, only this changes.
function getToken() {
  return localStorage.getItem("token");
}

// Every request funnels through here: attaches the auth header when
// a token exists, parses JSON, and throws a real Error with the
// server's message on non-2xx responses so callers can catch() it
// and show something useful instead of a silent failure.
async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};
