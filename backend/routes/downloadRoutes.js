import express from "express";
import { uploadLargeFileController, uploadLargeFileToS3Bucket } from "../downloadControler.js";
import { memoryUploadMiddlewaree, uploadMiddleware } from "../multerMiddleware.js";

const router = express.Router();

router.post("/upload-large-file", uploadMiddleware.single("chunk"), uploadLargeFileController);


router.post("/upload-single-file-S3", memoryUploadMiddlewaree.single("file"), uploadLargeFileToS3Bucket);

export default router;
