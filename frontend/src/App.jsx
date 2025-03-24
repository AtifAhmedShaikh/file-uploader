import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import UploadLargeFileToServer from "./pages/UploadLargeFilePage";
import DownloadLargeFile from "./pages/downloadLargeFilePage";
import FileUploadPage from "./pages/FileUploadPage";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken"); // Check if user is authenticated

  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Protected Routes */}
        <Route
          path="/upload-large-file"
          element={
            <ProtectedRoute>
              <UploadLargeFileToServer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/file-upload"
          element={
            <ProtectedRoute>
              <FileUploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/download-large-file"
          element={
            <ProtectedRoute>
              <DownloadLargeFile />
            </ProtectedRoute>
          }
        />
          <Route path="*" element={<>Not Found</>} />
      </Routes>
    </>
  );
}

export default App;
