import { backendURL } from "../constants";
import axios from "axios";

export const uploadChunk = async (chunk, chunkIndex, totalChunks, fileName, onProgress) => {
  const formData = new FormData();
  formData.append("chunk", chunk);
  formData.append("chunkIndex", chunkIndex);
  formData.append("totalChunks", totalChunks);
  formData.append("fileName", fileName);

  return axios.post(`${backendURL}/api/download/upload-large-file`, formData, {
    onUploadProgress: progressEvent => {
      if (onProgress) {
        const chunkProgress = Math.round((progressEvent.loaded / chunk.size) * 100);
        onProgress(chunkProgress);
      }
    },
    maxContentLength: 100000000,
    maxBodyLength: 100000000,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
