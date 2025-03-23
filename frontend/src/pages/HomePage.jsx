import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center bg-background mt-10">
      <button
        onClick={() => navigate("/file-upload")}
        className="cursor-pointer mx-auto bg-blue-500 text-white px-4 py-2 rounded"
      >
        File Upload
      </button>
      <button
        onClick={() => navigate("/upload-large-file")}
        className="cursor-pointer mx-5   bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload Large File
      </button>
    </div>
  );
};

export default HomePage;
