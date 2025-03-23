import { backendURL } from "../constants";
import axios from "axios";


const axiosInstance = axios.create({
  baseURL: backendURL,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(function (config) {
  const token=localStorage.getItem("authToken")||"";
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  } 
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

export const uploadChunk = async (chunk, chunkIndex, totalChunks, fileName, onProgress) => {
  const formData = new FormData();
  formData.append("chunk", chunk,fileName);
  formData.append("chunkIndex", chunkIndex);
  formData.append("totalChunks", totalChunks);
  formData.append("fileName", fileName);

  return axiosInstance.post(`/api/download/upload-large-file`, formData, {
    onUploadProgress: progressEvent => {
      if (onProgress) {
        const chunkProgress = Math.round(progressEvent.loaded / chunk.size * 100);
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

export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post(`/api/users/login`, {
      email,
      password
    });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error?.response?.data?.message||"Error while login" };
  }
};
