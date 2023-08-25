import logger from "../configs/logger.config.js";
import { updateLatestMessage } from "../services/conversation.service.js";
import {
  createMessage,
  getConversationMessages,
  populateMessage,
} from "../services/message.service.js";

export const sendMessage = async (request, response, next) => {
  try {
    const userId = request.user.userId;
    const { message, conversationId, files } = request.body;

    if (!conversationId || (!message && !files)) {
      logger.error("Please provide conversation id and message body.");
      return response.sendStatus(400);
    }

    const messageData = {
      sender: userId,
      message,
      conversation: conversationId,
      files: files || [],
    };

    let newMessage = await createMessage(messageData);
    let populatedMessage = await populateMessage(newMessage?._id);

    await updateLatestMessage(conversationId, newMessage);

    response.json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (request, response, next) => {
  try {
    const { conversationId } = request.params;

    if (!conversationId) {
      logger.error("Please add a conversation id in params");
      response.sendStatus(400);
    }

    const messages = await getConversationMessages(conversationId);

    response.json(messages);
  } catch (error) {
    next(error);
  }
};
