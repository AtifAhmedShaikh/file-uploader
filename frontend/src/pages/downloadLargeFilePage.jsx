import React, { useState } from "react";
import useFileDownloader from "../hooks/useFileDownload";

const Download = () => {
  const [fileName, setFileName] = useState("");
  const [step, setStep] = useState(1);

  const {
    progress,
    downloading,
    paused,
    errorMessage,
    checkFileExists,
    downloadFile,
    pauseDownload,
    resumeDownload,
  } = useFileDownloader();

  const handleCheckFile = async () => {
    if (!fileName.trim()) return;
    const exists = await checkFileExists(fileName);
    if (exists) setStep(2);
  };

  const goBack = () => {
    setStep(1);
    setFileName("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-md text-center">
        <h2 className="text-xl font-semibold mb-4">Chunked File Downloader</h2>

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Enter file name..."
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="mb-4 p-2 rounded bg-gray-700 text-white w-full"
            />
            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
            <button onClick={handleCheckFile} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600">
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden mb-4">
              <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="mb-4">{progress}% downloaded</p>

            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

            <div className="flex space-x-3">
              <button
             onClick={() => {
              console.log("Start Download Clicked"); // Debugging
              downloadFile(fileName);
            }}
            disabled={downloading && !paused}
                className={`px-4 py-2 rounded-lg text-white ${downloading && !paused ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"}`}
              >
                {downloading && !paused ? "Downloading..." : "Start Download"}
              </button>

              <button
                onClick={pauseDownload}
                disabled={!downloading || paused}
                className={`px-4 py-2 rounded-lg text-white ${!downloading || paused ? "bg-gray-600" : "bg-yellow-500 hover:bg-yellow-600"}`}
              >
                Pause
              </button>

              <button
                onClick={() => resumeDownload(fileName)}
                disabled={!paused}
                className={`px-4 py-2 rounded-lg text-white ${!paused ? "bg-gray-600" : "bg-green-500 hover:bg-green-600"}`}
              >
                Resume
              </button>
            </div>

            <button onClick={goBack} className="mt-4 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600">
              Go Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Download;
