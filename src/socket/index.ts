import { Server as SocketServer } from "socket.io";
import { PrismaClient } from "@prisma/client";
import MessageRepository from "../Repository/Message.repository";
import { Buffer } from "buffer";
import AWS from "aws-sdk";
const s3 = new AWS.S3();

const uploadToS3 = async (
  file: any,
  senderId: string,
  fileExtension: string
) => {
  const buffer = Buffer.from(file, "base64");
  console.log(fileExtension, "fileExtension");
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Key: `${Date.now()}_${senderId}.${fileExtension === "text/csv" ? "csv" : "jpeg"}`,
    Body: buffer,
    ContentType: fileExtension === "text/csv" ? "text/csv" : "image/jpeg",
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, (err: any, data: any) => {
      if (err) {
        console.log("Error uploading image: ", err);
        reject(err);
      } else {
        console.log("Image uploaded successfully: ", data.Location);
        resolve(data.Location);
      }
    });
  });
};

const prisma = new PrismaClient();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
export const initSockets = (io: SocketServer) => {
  console.log("Socket server started");
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a conversation
    socket.on("joinConversation", async ({ conversationId }) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });
    socket.on("leaveConversation", ({ conversationId }) => {
      socket.leave(conversationId);
      console.log(`User ${socket.id} left conversation: ${conversationId}`);
    });
    socket.on(
      "sendMessage",
      async ({
        conversationId,
        senderId,
        messageBody,
        messageType,
        file,
        username,
        fileExtension,
      }) => {
        const uniqueMessageId = conversationId + Date.now();
        socket.emit("loadingStatus", {
          status: "uploading",
          messageId: uniqueMessageId,
        });
        const messageRepository = new MessageRepository(prisma);
        let imgLocation = null;

        // If there's a file, upload it first
        if (file) {
          try {
            console.log(
              file,
              "------------------------------------------------ file-----------------------------------------------------"
            );
            imgLocation = await uploadToS3(file, senderId, fileExtension);
            console.log("Image uploaded successfully: ", imgLocation);
          } catch (error) {
            console.log("Error uploading image: ", error);
            socket.emit("error", "Error uploading image");
            return;
          }
        }

        // Create the message with or without a file URL
        const message = await messageRepository.create({
          conversationId,
          senderId,
          body: messageBody || "",
          type: messageType,
          isSeen: false,
          file: imgLocation ? [imgLocation as string] : [],
        });

        // Emit the new message to all clients in the conversation
        io.to(conversationId).emit("newMessage", {
          ...message,
          file: imgLocation ? [imgLocation] : [],
        });

        // Confirm the upload status
        io.to(conversationId).emit("loadingStatus", {
          status: "uploaded",
          messageId: uniqueMessageId,
        });
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
