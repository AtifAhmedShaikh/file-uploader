import express from "express";

import { uploadMiddleware } from "../multerMiddleware.js";
import {
  downloadLargeFileController,
  getFileInfo,
  uploadLargeFileController,
} from "../downloadControler.js";
const router = express.Router();

router.post(
  "/upload-large-file", uploadMiddleware.single("chunk"), uploadLargeFileController
);

router.get("/file-info", getFileInfo);

router.get("/download-large-file", downloadLargeFileController);

export default router;
