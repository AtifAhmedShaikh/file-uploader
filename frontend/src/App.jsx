import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import UploadLargeFileToServer from "./pages/UploadLargeFilePage";
import DownloadLargeFile from "./pages/downloadLargeFilePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/upload-large-file"
          element={<UploadLargeFileToServer />}
        />
        <Route path="/download-large-file" element={<DownloadLargeFile />} />
      </Routes>
    </>
  );
}

export default App;
