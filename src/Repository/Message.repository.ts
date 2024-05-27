import { Message, PrismaClient, User } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { CustomError } from "../Errors/CustomError";

const MessageResponseDTO = {
  id: true,
  body: true,
  file: true,
  createdAt: true,
  deletedAt: true,
  conversationId: true,
  senderId: true,
  type: true,
  sender: {
    select: {
      id: true,
      username: true,
      email: true,
      image: true,
    },
  },
  isSeen: true,
};

export default class MessageRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(
    message: Omit<Message, "id" | "createdAt" | "deletedAt">
  ): Promise<Omit<Message, "senderId">> {
    const created = await this.prisma.message.create({
      data: message,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            image: true,
          },
        },
      },
    });
    return created;
  }

  async getMessages(
    conversationId: string
  ): Promise<Omit<Message, "senderId">[]> {
    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      select: MessageResponseDTO,
    });
    return messages;
  }

  async getMessage(
    messageId: string
  ): Promise<Omit<Message, "senderId"> | null> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: MessageResponseDTO,
    });
    return message;
  }

  async deleteMessage(
    messageId: string
  ): Promise<Omit<Message, "senderId"> | null> {
    const deleted = await this.prisma.message.delete({
      where: { id: messageId },
      select: MessageResponseDTO,
    });
    return deleted;
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: { conversationId: conversationId },
      orderBy: { createdAt: "asc" },
    });
    return messages;
  }
  async markMessageAsSeen(
    messageId: string,
    userId: string
  ): Promise<Message | null> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { isSeen: true },
    });

    if (message && message.isSeen === false) {
      return (await this.prisma.message.update({
        where: { id: messageId },
        data: { isSeen: true },
      })) as Message;
    }

    return { id: messageId } as Message;
  }

  async update({
    messageId,
    message,
  }: {
    messageId: string;
    message: Partial<Message>;
  }) {
    const updated = await this.prisma.message.update({
      where: { id: messageId },
      data: message,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            image: true,
          },
        },
      },
    });
    return updated;
  }
}
