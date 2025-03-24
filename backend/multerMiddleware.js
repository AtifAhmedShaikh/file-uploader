import multer from "multer";
import fs from "node:fs";
import path from "node:path";

// Create the directory If does not exists
const ensureUploadDirectoryExists = directory => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const setUploadDestination = (req, file, callback) => {
  const uploadPath = path.resolve("uploads");

  ensureUploadDirectoryExists(uploadPath);

  req.uploadDirectory = uploadPath;
  callback(null, uploadPath);
};

const storageConfig = multer.diskStorage({
  destination: setUploadDestination,
  filename: (req, file, callback) => callback(null, file.originalname)
});

// middleware for handling file uploads using Multer. by disk storage
export const uploadMiddleware = multer({ storage: storageConfig });

const momoryStorageMulter = multer.memoryStorage();

// middleware for handling file uploads using Multer. by memory  storage
export const memoryUploadMiddlewaree = multer({ storage: momoryStorageMulter });
