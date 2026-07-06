import { api } from "./client";

// NOTE: mirrors the /api/auth routes sketched earlier
// (POST /register, POST /login) — build those the same way as
// the dorms controller/routes if they don't exist on the backend yet.
export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (payload) => api.post("/auth/register", payload),
};
