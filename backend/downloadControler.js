import fs from "node:fs";
import path from "node:path";
import { mergeChunks } from "./helper.js";
import { completeMultipartUploadToS3, startMultipartFileUploadToS3, uploadSingleFilePartToS3, uploadSingleFileToS3 } from "./uploadToS3.js";

// declare the uploaded object in global
const uploadedMultipart={}

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

// upload single file to S3 bucket
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

// upload large file on the S3 bucket by chunking
export const uploadLargeFileToS3WithChunking = async (req, res) => {
  const { fileName } = req.body;
  const chunkIndex=Number(req.body.chunkIndex||0) // convert to number
  const totalChunks=Number(req.body.totalChunks||0) // convert to number
  if (!req.file || chunkIndex < 0 || !fileName || !totalChunks) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  console.log(req.file);

  const pathKey = "staging/testing";
  const chunkBuffer = req.file.buffer; // Read directly from buffer

  // Initialize multipart upload if it's the first chunk
  if (chunkIndex === 0) {
    const uploadedChunk=await startMultipartFileUploadToS3(fileName, pathKey);
    console.log("UP C",uploadedChunk)
    if(uploadedChunk){
      uploadedMultipart[fileName] = {
        uploadId:uploadedChunk,
        parts: [],
      };
    }
  }
  const uploadId = uploadedMultipart[fileName]?.uploadId;
  if (!uploadId) {
    return res.status(500).json({ error: "Upload ID not found" });
  }

  // Upload chunk to S3
  const part = await uploadSingleFilePartToS3(uploadId, fileName, chunkIndex + 1, chunkBuffer, pathKey);
  if (!part) return res.status(500).json({ error: "Error uploading chunk" });

  uploadedMultipart[fileName].parts.push(part);

  console.log(`Chunk ${chunkIndex + 1}/${totalChunks} uploaded.`);
  // Finalize upload when all chunks are received
  if (uploadedMultipart[fileName].parts.length === totalChunks) {
    const finalUrl = await completeMultipartUploadToS3(uploadId, fileName, uploadedMultipart[fileName].parts, pathKey);
    delete uploadedMultipart[fileName]; // Clean up memory

    return res.json({ message: "Upload complete", url: finalUrl });
  }

  res.status(200).json({ message: `Chunk ${chunkIndex + 1} uploaded` });
};

