import createHttpError from "http-errors";
import { MessageModel } from "../models/index.js";

export const createMessage = async (messageData) => {
  let newMessage = await MessageModel.create(messageData);

  if (!newMessage) {
    throw createHttpError.BadRequest("Oops... Something went wrong !");
  }

  return newMessage;
};

export const populateMessage = async (id) => {
  let message = await MessageModel.findById(id)
    .populate({
      path: "sender",
      select: "name picture",
      model: "UserModel",
    })
    .populate({
      path: "conversation",
      select: "name picture isGroup users",
      model: "ConversationModel",
      populate: {
        path: "users",
        select: "name email picture status",
        model: "UserModel",
      },
    });

  if (!message) {
    throw createHttpError.BadRequest("Oops... Something went wrong !");
  }

  return message;
};

export const getConversationMessages = async (conversationId) => {
  const messages = await MessageModel.find({
    conversation: conversationId,
  })
    .populate("sender", "name picture email status")
    .populate("conversation");

  if (!messages) {
    throw createHttpError.BadRequest("Oops... Something went wrong !");
  }

  return messages;
};
