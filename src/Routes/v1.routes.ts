import { Router } from "express";

import userRoutes from "./v1/user.routes";
import conversationRoutes from "./v1/conversation.route";
import { verifyAccessToken } from "../middlewares/verifyAccessToken";
import messageRoutes from "./v1/messages.route";
import { asyncWrapper } from "../utils/asyncWrapper";
import uploadRoutes from "./v1/upload.route";

const router = Router();

router.use("/user", asyncWrapper(userRoutes));
router.use(
  "/conversation",
  asyncWrapper(verifyAccessToken),
  asyncWrapper(conversationRoutes)
);

router.use(
  "/message",
  asyncWrapper(verifyAccessToken),
  asyncWrapper(messageRoutes)
);

router.use(
  "/upload",
  asyncWrapper(verifyAccessToken),
  asyncWrapper(uploadRoutes)
);

export default router;
