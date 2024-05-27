import express from "express";
import { Request } from "express";
import { upload, uploadSingleFileToS3 } from "../../utils/fileUpload";

const router = express.Router();

router.post("/upload", upload.single("file"), async (req: Request, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  try {
    const result = await uploadSingleFileToS3(
      req.file,
      process.env.AWS_S3_BUCKET_NAME as string
    );
    res
      .status(201)
      .send({ message: "File uploaded successfully", data: result });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: "Failed to upload file", error: error.message });
  }
});

export default router;
