import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import {
  createConversation,
  doesConversationExist,
  populateConversation,
} from "../services/conversation.service.js";
import { findUser } from "../services/user.service.js";

export const createOrOpenConversation = async (request, response, next) => {
  try {
    const senderId = request.user.userId;
    const { receiverId } = request.body;

    // check if receiverId is provided
    if (!receiverId) {
      logger.error(
        "Please provide user id  you wanna start a conversation with !"
      );

      throw createHttpError.BadRequest("Oops... Something went wron !");
    }

    // check if conversation exist
    const existedConversation = await doesConversationExist(
      senderId,
      receiverId
    );

    if (existedConversation) {
      response.json(existedConversation);
    } else {
      let receiverUser = await findUser(receiverId);

      let conversationData = {
        name: receiverUser?.name,
        isGroup: false,
        users: [senderId, receiverId],
      };

      const newConversation = await createConversation(conversationData);

      const populatedConversation = await populateConversation(
        newConversation?._id,
        "users",
        "-password"
      );
      response.status(200).json(populatedConversation);
    }
  } catch (error) {
    next(error);
  }
};