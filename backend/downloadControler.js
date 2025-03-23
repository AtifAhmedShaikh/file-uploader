import fs from "node:fs";
import path from "node:path";
import { mergeChunks } from "./helper.js";
import { uploadSingleFileToS3 } from "./uploadToS3.js";

export const uploadLargeFileController = (req, res) => {
  const { chunkIndex, totalChunks, fileName } = req.body;
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  if (!fileName || !totalChunks || chunkIndex < 0) {
    return res.status(400).json({ error: "Missing required parameters" });
  }
  const uploadDir = req.uploadDirectory;
  const chunkPath = path.join(uploadDir, `${fileName}.part${chunkIndex}`);

  // Save chunk
  fs.renameSync(req.file.path, chunkPath);
  console.log(`Received chunk ${chunkIndex}/${totalChunks}`);

  // Check if all chunks are uploaded
  if (fs.readdirSync(uploadDir).filter(f => f.startsWith(fileName)).length == totalChunks) {
    mergeChunks(fileName, totalChunks, uploadDir);
  }
  res.sendStatus(200);
};

export const uploadLargeFileToS3Bucket = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log("Printed file ", req.file);
    const result = await uploadSingleFileToS3(req.file);
    if (!result) {
      return res.status(500).json({ message: "Failed to upload file" });
    }

    res.status(200).json({ message: "File uploaded successfully", data: result });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
