import { useState, useRef } from "react";
import axios from "axios";
import { axiosInstance } from "../utils/APIs";

const useFileDownloader = () => {
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileSize, setFileSize] = useState(0);

  const controllerRef = useRef(null);
  const receivedChunksRef = useRef([]);
  const downloadedSizeRef = useRef(0);
  const pausedRef = useRef(false);

  const CHUNK_SIZE = 10 ** 6; // 1MB per chunk

  const checkFileExists = async (fileName) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/api/download/file-info?fileName=${fileName}`
        
      );
      console.log("RESPONSE IS" ,response )
      setFileSize(response.data?.data?.fileSize);
      return response.data;
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "File not found.");
      return null;
    }
  };

  const downloadFile = async (fileName) => {
    try {
      setDownloading(true);
      setPaused(false);
      setErrorMessage("");
      pausedRef.current = false;
      controllerRef.current = new AbortController();

      

      while (downloadedSizeRef.current < fileSize) {
        if (pausedRef.current) return;

        const rangeHeader = `bytes=${downloadedSizeRef.current}-${Math.min(
          downloadedSizeRef.current + CHUNK_SIZE - 1,
          fileSize - 1
        )}`;

        console.log("Starting download request for:", fileName);
console.log("Expected API URL:", `http://localhost:5000/api/download/download-large-file?fileName=${fileName}`);


        const response = await axiosInstance.get(
          `http://localhost:5000/api/download/download-large-file?fileName=${fileName}`,
          {
            headers: { Range: rangeHeader },
            responseType: "arraybuffer",
            signal: controllerRef.current.signal,
          }
        );

        receivedChunksRef.current.push(response.data);
        downloadedSizeRef.current += response.data.byteLength;
        setProgress(Math.round((downloadedSizeRef.current / fileSize) * 100));
      }

      if (downloadedSizeRef.current >= fileSize) {
        mergeChunksAndDownload(fileName);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Download paused");
      } else {
        setErrorMessage(error.message || "An error occurred.");
      }
      setDownloading(false);
    }
  };

  const mergeChunksAndDownload = (fileName) => {
    try {
      const blob = new Blob(receivedChunksRef.current);
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloading(false);
    } catch (error) {
      console.log(error)
      setErrorMessage("Error merging file.");
    }
  };

  const pauseDownload = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      pausedRef.current = true;
      setPaused(true);
    }
  };

  const resumeDownload = (fileName) => {
    if (!paused) return;
    setPaused(false);
    pausedRef.current = false;
    downloadFile(fileName);
  };

  return {
    progress,
    downloading,
    paused,
    errorMessage,
    checkFileExists,
    downloadFile,
    pauseDownload,
    resumeDownload,
  };
};

export default useFileDownloader;
