import React, { useState, useEffect } from "react";
import axios from "axios";
import ResumeDropzone from "../../components/Resume/ResumeDropzone";
import { useUserStore } from "../../store/UserStore";
import { toast } from "react-toastify";

const Resume: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);           // Stores the file selected for upload
  const [fileUrl, setFileUrl] = useState<string | null>(null);    // Stores the URL for viewing the resume

  // Get existing resume details from the global store
  const resumeName = useUserStore((state) => state.resume);
  const userId = useUserStore((state) => state.id);
  const updateResume = useUserStore((state) => state.updateResume);
  const updateResumeId = useUserStore((state) => state.updateResumeId);

  useEffect(() => {
    // If there’s an existing resume, initialize fileUrl with it
    if (resumeName) {
      setFileUrl(`/resumeviewer/${userId}`); // Assuming this is the URL pattern for viewing
    }
  }, [resumeName, userId]);

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a resume file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("id", userId);

    try {
      const response = await axios.post("http://localhost:8000/users/uploadresume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        const { fileUrl: newFileUrl } = response.data;

        if (newFileUrl) {
          setFileUrl(newFileUrl);  // Update local file URL for immediate view
          updateResume(file.name);  // Update resume name in the global store
          updateResumeId(userId);   // Update resume ID in the global store
        }
        
        toast.success("Resume uploaded successfully! Please sign out and sign in to view changes");
      } else {
        toast.error("Unexpected response status. Please try again.");
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error uploading the resume:", error);
      toast.error("Resume upload failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-1/3">
        <ResumeDropzone onFileUpload={(acceptedFiles) => setFile(acceptedFiles[0])} />
        <div className="flex flex-row">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded"
          >
            Upload Resume
          </button>
        </div>

        {resumeName && fileUrl ? (
          <div className="mt-4">
            <p>Current Resume: {resumeName}</p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 mt-2 font-bold text-white bg-red-500 rounded"
            >
              View Current Resume
            </a>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No resume uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default Resume;
