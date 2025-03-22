import fs from "node:fs";
import path from "node:path";
import { mergeChunks } from "./helper.js";

export const uploadLargeFileController = (req, res) => {
  const { chunkIndex, totalChunks, fileName } = req.body;
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
