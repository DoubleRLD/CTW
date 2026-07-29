import { api } from "./client";

export const messagesApi = {
  getConversation: (matchId) =>
    api.get(`/messages/${matchId}`, { auth: true }),

  send: (matchId, message) =>
    api.post(
      `/messages/${matchId}`,
      { message },
      { auth: true }
    ),
};