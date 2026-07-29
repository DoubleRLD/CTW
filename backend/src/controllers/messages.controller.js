import * as MessagesModel from "../models/messages.model.js";
import { asyncHandler, ApiError } from "../middleware/errorHandler.js";

// GET /api/messages/:matchId
export const getConversation = asyncHandler(async (req, res) => {
  const matchId = Number(req.params.matchId);
  const userId = req.user.userId;

  const match = await MessagesModel.findAcceptedMatchForUser(matchId, userId);

  if (!match) {
    throw new ApiError(
      403,
      "You can only message users from an accepted roommate match."
    );
  }

let conversation =
  await MessagesModel.findConversationByMatch(matchId);

if (!conversation) {
  conversation =
    await MessagesModel.createConversation(matchId);
}
  const messages = await MessagesModel.findMessagesByConversation(
    conversation.conversation_id
  );

  res.json({
    conversation,
    messages,
  });
});

// POST /api/messages/:matchId
export const sendMessage = asyncHandler(async (req, res) => {
  const matchId = Number(req.params.matchId);
  const userId = req.user.userId;
  const messageText = req.body.message?.trim();

  if (!messageText) {
    throw new ApiError(400, "Message cannot be empty.");
  }

  const match = await MessagesModel.findAcceptedMatchForUser(matchId, userId);

  if (!match) {
    throw new ApiError(
      403,
      "You can only message users from an accepted roommate match."
    );
  }

  let conversation =
    await MessagesModel.findConversationByMatch(matchId);

    if (!conversation) {
        conversation =
            await MessagesModel.createConversation(matchId);
    }
  const message = await MessagesModel.createMessage({
    conversationId: conversation.conversation_id,
    senderUserId: userId,
    messageText,
  });

  res.status(201).json(message);
});