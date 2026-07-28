import { api } from "./client";

export const adminUsersApi = {
  list: () => api.get("/admin/users", { auth: true }),
  setBanned: (id, banned) =>
    api.patch(`/admin/users/${id}/ban`, { banned }, { auth: true }),
  setAdmin: (id, isAdmin) =>
    api.patch(`/admin/users/${id}/admin`, { isAdmin }, { auth: true }),
};
