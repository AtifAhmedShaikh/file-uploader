import express from "express";
import { uploadLargeFileController } from "../downloadControler.js";
import { uploadMiddleware } from "../multerMiddleware.js";

const router = express.Router();

router.post("/upload-large-file", uploadMiddleware.single("chunk"), uploadLargeFileController);

export default router;
