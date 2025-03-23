import fs from "node:fs";
import path from "node:path";
import { uploadSingleFileToS3 } from "./uploadToS3.js";

const handleUploadAllChunksToS3 = async (finalPath, fileName) => {
  const fileExtension = path.extname(fileName); // Extract file extension
  const baseFileName = path.basename(fileName, fileExtension); // Remove extension from name
  const fileBuffer = fs.readFileSync(finalPath); // Read file buffer

  const uploadedFile = await uploadSingleFileToS3(
    { buffer: fileBuffer, originalname: `${baseFileName}${fileExtension}` }, // pass buffer, originalname, extension
    "staging/large-uploads"
  );

  // Delete the local merged file after successful upload
  fs.unlinkSync(finalPath);

  console.log("Uploaded file to S3:", uploadedFile);

  return uploadedFile;
};

// define helper function for chunking
export const mergeChunks = (fileName, totalChunks, uploadDir) => {
  const finalPath = path.join(uploadDir, fileName);
  const writeStream = fs.createWriteStream(finalPath);

  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(uploadDir, `${fileName}.part${i}`);
    const chunkData = fs.readFileSync(chunkPath);
    writeStream.write(chunkData);
    fs.unlinkSync(chunkPath);
  }

  writeStream.end();
  // Wait for the file to be fully written before proceeding
  writeStream.on("finish", () => handleUploadAllChunksToS3(finalPath, fileName));
  console.log(`File merged: ${fileName}`);
};
