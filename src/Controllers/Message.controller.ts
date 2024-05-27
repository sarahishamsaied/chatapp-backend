import { Request, Response, NextFunction } from "express";
import prisma from "../config/prismaClient";
import MessageRepository from "../Repository/Message.repository";

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { conversationId, senderId, body, file, type } = req.body;
  const messageRepository = new MessageRepository(prisma);
  const message = await messageRepository.create({
    conversationId,
    senderId,
    body,
    file,
    type,
    isSeen: false,
  });
  res.json(message);
};

export const getConversationMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { conversationId } = req.params;
  const messageRepository = new MessageRepository(prisma);
  const messages = await messageRepository.getMessages(conversationId);
  res.json(messages);
};
