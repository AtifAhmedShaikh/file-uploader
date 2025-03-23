import React from "react";
import FileUpload from "../components/Fileupload/FIlerUploader";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const FileUploadPage = () => {
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate("/");
  };
  return (
    <div className="w-full">
      <div className="w-full flex justify-end">
        <Button className={"mt-5 mr-0"} onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <h3 className="w-full text-3xl text-center mx-auto">Welcome to the Large File Upload Platform</h3>
      <FileUpload />
    </div>
  );
};

export default FileUploadPage;
