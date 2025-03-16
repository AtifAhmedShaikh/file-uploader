import { useState, useRef } from "react";
import { Progress } from "../components/ui/progress";

const UploadLargeFileToServer = ({ speedLimit = 100 }) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [message, setMessage] = useState("");

  const fileRef = useRef(null);
  const uploadedChunksRef = useRef(0);
  const pauseRef = useRef(false);

  const uploadFile = async (file) => {
    const chunkSize = 5 * 1024 * 1024; // 5MB per chunk
    const totalChunks = Math.ceil(file.size / chunkSize);

    // Convert speedLimit (KB/s) to bytes per second
    const maxUploadSpeed = speedLimit * 1024; // KB -> Bytes
    const delayPerChunk = Math.ceil((chunkSize / maxUploadSpeed) * 1000); // Delay in ms

    setUploading(true);
    setMessage("");

    for (let i = uploadedChunksRef.current; i < totalChunks; i++) {
      // Pause handling
      if (pauseRef.current) {
        setPaused(true);
        return;
      }

      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("chunkIndex", i);
      formData.append("totalChunks", totalChunks);
      formData.append("fileName", file.name);

      try {
        await fetch("http://localhost:5000/api/download/upload-large-file", {
          method: "POST",
          body: formData
        });

        uploadedChunksRef.current = i + 1;
        setProgress(Math.round((uploadedChunksRef.current / totalChunks) * 100));

        // Simulate network throttling
        await new Promise((resolve) => setTimeout(resolve, delayPerChunk));
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
    if (!fileRef.current) return;
    pauseRef.current = false;
    setPaused(false);
    uploadFile(fileRef.current);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-4 max-w-md mx-auto bg-green-50 border border-green-700 shadow-md rounded-xl">
        <h2 className="text-lg font-semibold mb-3">Chunked File Upload</h2>
        <p className="text-sm font-semibold mb-3">Upload Large File to the server using chunck by chunck </p>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files.length) {
              fileRef.current = e.target.files[0];
              uploadedChunksRef.current = 0; // Reset upload progress
              uploadFile(fileRef.current);
            }
          }}
          disabled={uploading}
          className="mb-2 border p-2 rounded w-full"
        />
        Progress: {progress}%
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
            <Progress value={progress} />
          </div>
        )}
        {uploading && (
          <div className="mt-3 flex gap-3">
            {!paused ? (
              <button onClick={handlePause} className="bg-yellow-500 px-4 py-2 rounded">
                Pause
              </button>
            ) : (
              <button onClick={handleResume} className="bg-green-500 px-4 py-2 rounded">
                Resume
              </button>
            )}
          </div>
        )}
        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default UploadLargeFileToServer;
