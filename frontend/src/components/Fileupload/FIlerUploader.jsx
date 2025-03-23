import useFileUploader from "../../hooks/useFileUploader";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

const FileUpload = () => {
  const {
    progress,
    chunkProgress,
    uploading, // loading boolean for upload
    paused,
    message,
    handleFileSelect,
    uploadFile, // method for file upload
    handlePause,
    handleResume,
    totalFileChunks, // total number of chunks
    uploadedChunks// total number of uploaded chunks
  } = useFileUploader();

  return (
    <div className="flex justify-center items-center h-screen bg-primary-foreground">
      <div className="p-4 max-w-md mx-auto bg-green-50 border border-green-700 shadow-md rounded-xl">
        <h2 className="text-lg font-semibold mb-3">Chunked File Upload</h2>
        <p className="text-sm font-semibold mb-3">Upload large file to the server using chunk by chunk</p>
        <p className="text-sm font-semibold mb-3"> 2MB Per Chunk</p>
        <input
          type="file"
          onChange={handleFileSelect}
          disabled={uploading}
          className="mb-2 border p-2 rounded w-full"
        />
        <Button className="disabled:!bg-gray-400 disabled:text-gray-700" onClick={uploadFile} disabled={uploading}>
          Start Upload
        </Button>
        {uploading && (
          <div className="bg-gray-100 mt-5 p-3 rounded-lg border border-gray-300 mb-3">
            <p className="text-sm font-medium text-gray-700">
              Uploading chunk <span className="font-bold text-blue-600"> {uploadedChunks} </span>
              of <span className="font-bold">{totalFileChunks}</span>
            </p>
            <p className="text-sm text-gray-600">
              Remaining Chunks: <span className="font-semibold text-red-500">{totalFileChunks - uploadedChunks}</span>
            </p>
            <p className="text-sm text-gray-600">
              Current Chunk Progress: <span className="font-semibold text-green-500">{chunkProgress}%</span>
            </p>
          </div>
        )}
        <p className="text-lg font-bold">Total Progress: {progress}%</p>
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
            <Progress value={progress} />
          </div>
        )}
        {uploading && (
          <div className="mt-3 flex gap-3">
            {!paused ? (
              <Button onClick={handlePause} className="bg-yellow-500">
                Pause
              </Button>
            ) : (
              <Button onClick={handleResume} className="bg-green-500">
                Resume
              </Button>
            )}
          </div>
        )}
        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default FileUpload;
