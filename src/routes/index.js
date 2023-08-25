import express from "express";
import authRoutes from "./auth.route.js";
import conversationRoutes from "./conversation.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/conversation", conversationRoutes);

export default router;
