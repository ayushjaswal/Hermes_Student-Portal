// routes/dataRoutes.js
import express from "express";
import { authorization } from "../middlewares/auth.js";
import {
  createContactMessage,
  fetchContactMessages,
  fetchSingleContactMessage,
  replyContactMessage,
} from "../Controllers/contactController.js";

const router = express.Router();

// Define routes for inserting data
router.get(
  "/fetch-contact-messeges/:recieverId",
  authorization,
  fetchContactMessages
);
router.post("/create-contact-messege", authorization, createContactMessage);
router.get(
  "/get-contact-message/:messageId",
  authorization,
  fetchSingleContactMessage
);
router.post("/create-contact-reply", authorization, replyContactMessage);
export default router;
