import fs from "node:fs";
import path from "node:path";

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
  console.log(`File merged: ${fileName}`);
};
