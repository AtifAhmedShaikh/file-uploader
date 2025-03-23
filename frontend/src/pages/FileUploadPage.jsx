import React from "react";
import FileUpload from "../components/Fileupload/FIlerUploader";

const FileUploadPage = () => {
  return (
    <div>
      <h3 className="w-full text-3xl mx-auto">Welcome to the Large File Upload Platform</h3>
      <FileUpload />
    </div>
  );
};

export default FileUploadPage;
