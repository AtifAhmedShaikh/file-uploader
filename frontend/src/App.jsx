import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import UploadLargeFileToServer from "./pages/UploadLargeFilePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload-large-file" element={<UploadLargeFileToServer />} />
      </Routes>
    </>
  );
}

export default App;
