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
      select: "name isGroup users",
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
