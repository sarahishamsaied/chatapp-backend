// src/services/fileUploadService.ts

import { s3Client } from "../config/awsConfig";
import { S3 } from "aws-sdk";
import { Request } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

const uploadSingleFileToS3 = async (
  file: Express.Multer.File,
  bucketName: string
): Promise<S3.ManagedUpload.SendData> => {
  const params = {
    Bucket: bucketName,
    Key: `${uuidv4()}-${file.originalname}`,
    Body: file.buffer,
    ACL: "public-read",
  };

  try {
    const data = await s3Client.upload(params).promise();
    return data;
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw new Error("File upload failed");
  }
};

export { upload, uploadSingleFileToS3 };
