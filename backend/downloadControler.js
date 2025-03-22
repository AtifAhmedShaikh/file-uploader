import fs from "node:fs";
import path from "node:path";
import { mergeChunks } from "./helper.js";

const FILE_PATH = "uploads";

export const uploadLargeFileController = (req, res) => {
  const { chunkIndex, totalChunks, fileName } = req.body;
  const uploadDir = req.uploadDirectory;
  const chunkPath = path.join(uploadDir, `${fileName}.part${chunkIndex}`);

  // Save chunk
  fs.renameSync(req.file.path, chunkPath);
  console.log(`Received chunk ${chunkIndex}/${totalChunks}`);

  // Check if all chunks are uploaded
  if (
    fs.readdirSync(uploadDir).filter((f) => f.startsWith(fileName)).length ==
    totalChunks
  ) {
    mergeChunks(fileName, totalChunks, uploadDir);
  }

  res.sendStatus(200);
};

export const getFileInfo = (req, res) => {
  try {
    const { fileName } = req.query;
    console.log("File info requested:", fileName);

    const filePath = path.join(FILE_PATH, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        data: null,
        message: "File not found",
      });
    }

    const stat = fs.statSync(filePath);
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: { fileSize: stat.size },
      message: "File info retrieved successfully",
    });
  } catch (error) {
    console.error("File info error:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      data: null,
      message: "Failed to retrieve file info",
      error: error.message,
    });
  }
};

export const downloadLargeFileController = (req, res) => {
  try {
    const { fileName } = req.query;
    console.log("File name:", fileName);
    const filePath = path.join(FILE_PATH, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        data: null,
        message: "File not found",
      });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    let range = req.headers.range;

    if (!range) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        data: null,
        message: "Range header required",
      });
    }

    const CHUNK_SIZE = 10 ** 6; // 1MB chunks
    const parts = range.replace(/bytes=/, "").split("-");
    let start = parseInt(parts[0], 10);
    let end = parts[1]
      ? parseInt(parts[1], 10)
      : Math.min(start + CHUNK_SIZE - 1, fileSize - 1);

    if (isNaN(start) || start >= fileSize || start < 0) {
      return res.status(416).json({
        success: false,
        statusCode: 416,
        data: null,
        message: "Range Not Satisfiable",
      });
    }

    end = Math.min(end, fileSize - 1);
    const contentLength = end - start + 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);
    const fileStream = fs.createReadStream(filePath, { start, end });
    fileStream.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      data: null,
      message: "File download failed",
      error: error.message,
    });
  }
};
