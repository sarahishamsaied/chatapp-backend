import { Request, Response, NextFunction } from "express";
import prisma from "../config/prismaClient";
import ConversationRepository from "../Repository/Conversation.repository";
import { CustomRequest } from "../middlewares/verifyAccessToken";

export const createConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, isGroup, userIds } = req.body;
  const admin = (req as CustomRequest).userId as string;

  const conversationRepository = new ConversationRepository(prisma);
  const conversation = await conversationRepository.create({
    name,
    isGroup,
    userIds,
    admin,
  });
  res.json(conversation);
};

export const addUserToConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { conversationId, userId } = req.body;
  const conversationRepository = new ConversationRepository(prisma);
  await conversationRepository.addUserToConversation(conversationId, userId);
  res.json({ message: "User added to conversation" });
};

export const getConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { conversationId } = req.params;
  const conversationRepository = new ConversationRepository(prisma);
  const conversation =
    await conversationRepository.getConversation(conversationId);
  res.json(conversation);
};

export const createWithUsernames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, isGroup, usernames } = req.body;
  const admin = (req as CustomRequest).userId as string;
  const conversationRepository = new ConversationRepository(prisma);
  const conversation = await conversationRepository.createWithUsernames({
    name,
    isGroup,
    usernames,
    admin,
  });
  res.json(conversation);
};

export const getConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as CustomRequest).userId as string;
  const conversationRepository = new ConversationRepository(prisma);
  const conversations = await conversationRepository.getConversations(userId);
  res.json(conversations);
};

export const checkConversationOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { conversationId } = req.params;
  const userId = (req as CustomRequest).userId as string;
  const conversationRepository = new ConversationRepository(prisma);
  const conversation =
    await conversationRepository.getConversation(conversationId);
  if (!conversation)
    return res.status(404).json({ message: "Conversation not found" });
  if (conversation.admin !== userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export const isUserInConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { conversationId } = req.params;
  const userId = (req as CustomRequest).userId as string;
  const conversationRepository = new ConversationRepository(prisma);
  const conversation =
    await conversationRepository.getConversation(conversationId);
  if (!conversation)
    return res.status(404).json({ message: "Conversation not found" });
  if (!conversation.userIds.includes(userId) && conversation.admin !== userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
