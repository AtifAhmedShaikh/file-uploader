import express from "express";
import {
  uploadLargeFileController,
  uploadLargeFileToS3Bucket,
  uploadLargeFileToS3WithChunking
} from "../downloadControler.js";
import { memoryUploadMiddlewaree, uploadMiddleware } from "../multerMiddleware.js";

const router = express.Router();

// upload large file to server from client side and jsut stored in server
router.post("/upload-large-file", uploadMiddleware.single("chunk"), uploadLargeFileController);

router.post("/upload-single-file-S3", memoryUploadMiddlewaree.single("file"), uploadLargeFileToS3Bucket);

router.post("/upload-large-file-S3-chunks", memoryUploadMiddlewaree.single("chunk"), uploadLargeFileToS3WithChunking);

export default router;
