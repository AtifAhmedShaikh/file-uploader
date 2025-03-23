import React, { useState, useRef } from "react";

const Download = () => {
  const [fileName, setFileName] = useState(""); // User input for filename
  const [step, setStep] = useState(1); // UI step (1: enter file, 2: show buttons)
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const controllerRef = useRef(null);
  const receivedChunksRef = useRef([]);
  const downloadedSizeRef = useRef(0);
  const fileSizeRef = useRef(0);
  const pausedRef = useRef(false);

  const CHUNK_SIZE = 10 ** 6; // 1MB per chunk

  const checkFileExists = async () => {
    if (!fileName.trim()) {
      setErrorMessage("Please enter a file name.");
      return;
    }

    try {
      setErrorMessage(""); // Clear previous errors
      const fileInfoResponse = await fetch(
        `http://localhost:5000/api/download/file-info?fileName=${fileName}`
      );

      const fileInfo = await fileInfoResponse.json();
      if (!fileInfoResponse.ok || !fileInfo.data) {
        throw new Error(fileInfo.message || "File not found.");
      }

      fileSizeRef.current = fileInfo.data.fileSize;
      setStep(2); // Move to next step only if file exists
    } catch (error) {
      console.error("File check failed:", error);
      setErrorMessage(error.message || "Error checking file.");
    }
  };

  const goBack = () => {
    setStep(1);
    setFileName("");
    setProgress(0);
    setDownloading(false);
    setPaused(false);
    setErrorMessage("");
    receivedChunksRef.current = [];
    downloadedSizeRef.current = 0;
    fileSizeRef.current = 0;
    pausedRef.current = false;
  };

  const downloadFile = async () => {
    try {
      setDownloading(true);
      setPaused(false);
      setErrorMessage("");
      pausedRef.current = false;

      controllerRef.current = new AbortController();
      const { signal } = controllerRef.current;

      while (downloadedSizeRef.current < fileSizeRef.current) {
        if (pausedRef.current) return;

        const rangeHeader = `bytes=${downloadedSizeRef.current}-${Math.min(
          downloadedSizeRef.current + CHUNK_SIZE - 1,
          fileSizeRef.current - 1
        )}`;

        const response = await fetch(
          `http://localhost:5000/api/download/download-large-file?fileName=${fileName}`,
          {
            headers: { Range: rangeHeader },
            signal,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error downloading chunk.");
        }

        const chunk = await response.arrayBuffer();
        receivedChunksRef.current.push(chunk);

        downloadedSizeRef.current += chunk.byteLength;
        setProgress(
          Math.round((downloadedSizeRef.current / fileSizeRef.current) * 100)
        );
      }

      if (downloadedSizeRef.current >= fileSizeRef.current) {
        mergeChunksAndDownload();
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Download paused");
      } else {
        console.error("Download failed:", error);
        setErrorMessage(error.message || "An unexpected error occurred.");
        setDownloading(false);
      }
    }
  };

  const mergeChunksAndDownload = () => {
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
      setErrorMessage("");
    } catch (error) {
      console.error("Error merging file:", error);
      setErrorMessage("Error merging file. Please try again.");
    }
  };

  const pauseDownload = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      pausedRef.current = true;
      setPaused(true);
    }
  };

  const resumeDownload = () => {
    if (!paused) return;
    setPaused(false);
    pausedRef.current = false;
    downloadFile();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-md text-center">
        <h2 className="text-xl font-semibold mb-4">Localize File Downloader</h2>

        {/* Step 1: Enter File Name */}
        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Enter file name..."
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="mb-4 p-2 rounded bg-gray-700 text-white w-full"
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
            <button
              onClick={checkFileExists}
              className="px-4 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white"
            >
              Next
            </button>
          </>
        )}

        {/* Step 2: Show Download Buttons */}
        {step === 2 && (
          <>
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden mb-4">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mb-4">{progress}% downloaded</p>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}

            {/* Download Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={downloadFile}
                disabled={downloading && !paused}
                className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
                  downloading && !paused
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {downloading && !paused ? "Downloading..." : "Start Download"}
              </button>

              <button
                onClick={pauseDownload}
                disabled={!downloading || paused}
                className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
                  !downloading || paused
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
              >
                Pause
              </button>

              <button
                onClick={resumeDownload}
                disabled={!paused}
                className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
                  !paused
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                Resume
              </button>
            </div>

            {/* Go Back Button */}
            <button
              onClick={goBack}
              className="mt-4 px-4 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white"
            >
              Go Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Download;
