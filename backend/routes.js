import express from "express";
import { uploadLargeFileController } from "./downloadControler.js";
import { multerMiddleware } from "./multerMiddleware.js";

const router = express.Router();

router.post("/upload-large-file", multerMiddleware.single("chunk"), uploadLargeFileController);

export default router;
