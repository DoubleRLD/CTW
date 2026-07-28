import { api } from "./client";

export const moderationApi = {
  listReports: () => api.get("/moderation/reports", { auth: true }),
  resolveReport: (reportId, action) =>
    api.post(`/moderation/reports/${reportId}/resolve`, { action }, { auth: true }),
};
