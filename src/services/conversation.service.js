import createHttpError from "http-errors";
import { ConversationModel, UserModel } from "../models/index.js";

// populate means fill in the needed data

export const doesConversationExist = async (senderId, receiverId) => {
  let conversationList = await ConversationModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: senderId } } },
      { users: { $elemMatch: { $eq: receiverId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (!conversationList)
    throw createHttpError.BadRequest("Oops... Something went wrong !");

  // populate message model
  conversationList = await UserModel.populate(conversationList, {
    path: "latestMessage.sender",
    select: "name email picture status",
  });

  return conversationList[0];
};

export const createConversation = async (data) => {
  const newConversation = await ConversationModel.create(data);
  if (!newConversation) {
    throw createHttpError.BadRequest("Oops... Something went wrong !");
  }
  return newConversation;
};

export const populateConversation = async (
  id,
  fieldToPopulate,
  fieldsToRemove
) => {
  const populatedConversation = await ConversationModel.findOne({
    _id: id,
  })?.populate(fieldToPopulate, fieldsToRemove);

  if (!populatedConversation) {
    throw createHttpError.BadRequest("Oops... Something went wrong !");
  }

  return populatedConversation;
};

export const getUserConversations = async (userId) => {
  let conversations;
  await ConversationModel.find({
    users: { $elemMatch: { $eq: userId } },
  })
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await UserModel.populate(results, {
        path: "latestMessage.sender",
        select: "name email picture status",
      });
      conversations = results;
    })
    .catch((error) => {
      throw createHttpError.BadRequest("Oops... Something went wrong !");
    });

  return conversations;
};

export const updateLatestMessage = async (conversationId, message) => {
  const updatedConversation = await ConversationModel.findByIdAndUpdate(
    conversationId,
    {
      latestMessage: message,
    }
  );

  if (!updatedConversation) {
    throw createHttpError.BadRequest("Oops... Something went wrong !");
  }

  return updatedConversation;
};
