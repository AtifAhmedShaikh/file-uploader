import { useRef, useState } from "react";
import { CHUNK_SIZE, delayPerChunk } from "../constants";
import { uploadChunk } from "../utils/APIs";

const useFileUploader = () => {
  const [progress, setProgress] = useState(0); // total file upload progress
  const [chunkProgress, setChunkProgress] = useState(0); // single chunk upload progress
  const [uploading, setUploading] = useState(false); // loading state for uploading
  const [paused, setPaused] = useState(false);
  const [message, setMessage] = useState(""); // error or success message
  const [totalFileChunks, setTotalFileChunks] = useState(0); // error or success message

  const fileRef = useRef(null);
  const uploadedChunksRef = useRef(0);
  const pauseRef = useRef(false);

  // input file handler
  const handleFileSelect = e => {
    if (e.target.files.length) {
      fileRef.current = e.target.files[0];
      uploadedChunksRef.current = 0;
      setProgress(0);
      setMessage("");
    }
  };

  // method for uploading file to the server
  const uploadFile = async () => {
    if (!fileRef.current) return;

    const file = fileRef.current; // get the selected file
    // divide the file into chunks smaller chunks based on the file size
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE); // calculate the total chunks

    setUploading(true);
    setMessage("");
    setTotalFileChunks(totalChunks); // set the total chunks in state

    for (let i = uploadedChunksRef.current; i < totalChunks; i++) {
      if (pauseRef.current) {
        setPaused(true);
        return;
      }

      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      try {
        await uploadChunk(chunk, i, totalChunks, file.name, chunkProgress => {
          setChunkProgress(chunkProgress);
        });
        uploadedChunksRef.current = i + 1;
        setProgress(Math.round(uploadedChunksRef.current / totalChunks * 100));
        await new Promise(resolve => setTimeout(resolve, delayPerChunk));
      } catch (error) {
        console.error("Upload failed", error);
        setMessage("Upload failed! Please try again.");
        setUploading(false);
        return;
      }
    }

    setUploading(false);
    setPaused(false);
    setMessage("File uploaded successfully!");
  };

  const handlePause = () => {
    pauseRef.current = true;
    setPaused(true);
  };

  const handleResume = () => {
    if (!paused) return alert("File is not in paused state!");
    pauseRef.current = false;
    setPaused(false);
    uploadFile();
  };

  return {
    progress,
    chunkProgress,
    uploading,
    paused,
    message,
    handleFileSelect,
    uploadFile,
    handlePause,
    handleResume,
    uploadedChunks: uploadedChunksRef.current,
    totalFileChunks
  };
};

export default useFileUploader;
