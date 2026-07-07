import { api } from "./client";

export const roommateMatchesApi = {
  getMine: (semester, semesterYear) =>
    api.get(`/roommate-matches/me?semester=${semester}&semesterYear=${semesterYear}`, { auth: true }),
  getAnalysis: (matchId)=>
      api.get(`/roommate-matches/${matchId}/analysis`, {auth:true}),
  respond: (matchId, status) =>
    api.post(`/roommate-matches/${matchId}/respond`, { status }, { auth: true }),
};
