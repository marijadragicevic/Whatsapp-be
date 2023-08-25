import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createOrOpenConversation } from "../controllers/conversation.controller.js";

const router = express.Router();

router
  .route("/")
  .post(trimRequest.all, authMiddleware, createOrOpenConversation);

export default router;
