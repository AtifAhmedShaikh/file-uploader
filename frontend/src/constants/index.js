
export const backendURL = import.meta.env?.VITE_BACKEND_URL || "http://localhost:5000";

export const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB per chunk
export const speedLimit = 100;
export const maximumUploadSpeed=speedLimit *1024;
export const delayPerChunk=Math.ceil(CHUNK_SIZE / maximumUploadSpeed * 1000)