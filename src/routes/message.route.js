import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/authMiddleware.js";
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.route("/").post(trimRequest.all, authMiddleware, sendMessage);
router
  .route("/:conversationId")
  .get(trimRequest.all, authMiddleware, getMessages);

export default router;
