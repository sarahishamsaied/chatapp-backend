import { Router } from "express";

import {
  createConversation,
  addUserToConversation,
  getConversation,
  createWithUsernames,
  checkConversationOwnership,
  isUserInConversation,
  getConversations,
} from "../../Controllers/Conversation.controller";
import { asyncWrapper } from "../../utils/asyncWrapper";
import { verifyAccessToken } from "../../middlewares/verifyAccessToken";

const router = Router();

router.post("/", verifyAccessToken, asyncWrapper(createConversation));

router.post(
  "/add-user",
  verifyAccessToken,
  checkConversationOwnership,
  asyncWrapper(addUserToConversation)
);

router.get(
  "/:conversationId",
  verifyAccessToken,
  isUserInConversation,
  asyncWrapper(getConversation)
);

router.get("/", verifyAccessToken, asyncWrapper(getConversations));

router.post("/usernames", verifyAccessToken, asyncWrapper(createWithUsernames));

export default router;
