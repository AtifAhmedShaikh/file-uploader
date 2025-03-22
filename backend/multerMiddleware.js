import multer from "multer";
import fs from "node:fs";
import path from "node:path";

const fileDestinationHandler = (req, file, cb) => {
  // access upload folder path
  const uploadDir = path.join("uploads");
  // If uload folder directory not exits then create the folder
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
  // attach upload folder directory to request
  req.uploadDirectory = uploadDir;
  cb(null, uploadDir);
};

// Configure Multer to store files temporarily
const storage = multer.diskStorage({
  destination: fileDestinationHandler,
  filename: (req, file, cb) => cb(null, file.originalname),
});

export const multerMiddleware = multer({ storage });
