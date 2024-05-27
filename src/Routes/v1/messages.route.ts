import { Router } from "express";

import {
  createMessage,
  getConversationMessages,
} from "../../Controllers/Message.controller";

const router = Router();

router.post("/", createMessage);

router.get("/:conversationId", getConversationMessages);

export default router;
