import { api } from "./client";

export const roommateProfilesApi = {
  getMine: (semester, semesterYear) =>
    api.get(`/roommate-profiles/me?semester=${semester}&semesterYear=${semesterYear}`, { auth: true }),
  upsert: (payload) => api.post("/roommate-profiles", payload, { auth: true }),
  browse: (semester, semesterYear) =>
    api.get(`/roommate-profiles/browse?semester=${semester}&semesterYear=${semesterYear}`, { auth: true }),
};
