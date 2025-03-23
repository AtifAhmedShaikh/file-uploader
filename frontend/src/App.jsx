import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import UploadLargeFileToServer from "./pages/UploadLargeFilePage";
import DownloadLargeFile from "./pages/downloadLargeFilePage";
import FileUploadPage from "./pages/FileUploadPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/download-large-file" element={<DownloadLargeFile />} />
        <Route
          path="/upload-large-file"
          element={<UploadLargeFileToServer />}
        />
        <Route path="/file-upload" element={<FileUploadPage />} />
      </Routes>
    </>
  );
}

export default App;
