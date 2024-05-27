import { PrismaClient, Conversation, User } from "@prisma/client";

export default class ConversationRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create({
    name,
    isGroup,
    userIds,
    admin,
  }: {
    name: string;
    isGroup: boolean;
    userIds: string[];
    admin: string;
  }): Promise<Conversation> {
    const newConversation = await this.prisma.conversation.create({
      data: {
        name: name,
        isGroup: isGroup,
        userIds: userIds,
        createdAt: new Date(),
        admin,
      },
    });
    return newConversation;
  }

  async createWithUsernames({
    name,
    isGroup,
    usernames,
    admin,
  }: {
    name: string;
    isGroup: boolean;
    usernames: string[];
    admin: string;
  }) {
    const userIds = await this.prisma.user.findMany({
      where: {
        username: {
          in: usernames,
        },
      },
      select: {
        id: true,
      },
    });
    const ids = userIds.map((user) => user.id);
    return this.create({ name, isGroup, userIds: ids, admin });
  }

  async addUserToConversation(
    conversationId: string,
    userId: string
  ): Promise<void> {
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        userIds: {
          push: userId,
        },
      },
    });
  }

  async getConversation(conversationId: string): Promise<Conversation | null> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
          },
        },
      },
    });
    return conversation;
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    const conversations = await this.prisma.conversation.findMany({
      // in userIds or isadmin
      where: {
        OR: [
          {
            userIds: {
              has: userId,
            },
          },
          {
            admin: userId,
          },
        ],
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
          },
        },
      },
    });
    return conversations;
  }
}
