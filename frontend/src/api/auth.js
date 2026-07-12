import { api } from "./client";

export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (payload) => api.post("/auth/register", payload),
  verifyEmail: (token) => api.post("/auth/verify-email", { token }),
  resendVerification: (email) => api.post("/auth/resend-verification", { email }),
};
