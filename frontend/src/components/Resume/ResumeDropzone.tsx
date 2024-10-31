// UploadResume.tsx
import React, { useCallback, useState } from 'react';
import { useDropzone, DropzoneOptions, FileRejection } from 'react-dropzone';

interface UploadResumeProps {
  onUploadComplete: (fileUrl: string) => void;
}

const UploadResume: React.FC<UploadResumeProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) {
      setMessage('No files selected.');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('resume', files[0]); // Only allowing one file at a time

    try {
      const response = await fetch('/api/upload', { // Replace with your upload endpoint
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onUploadComplete(result.fileUrl); // Pass the file URL back to the parent component
      setMessage('File uploaded successfully');
    } catch (error) {
      console.error(error);
      setMessage('An error occurred during the upload.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    handleFileUpload(acceptedFiles);
    fileRejections.forEach((file) => console.error(`File rejected: ${file.file.name}`));
  }, []);

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 15 * 1024 * 1024, // 15 MB limit
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone(dropzoneOptions);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-xl font-semibold">Upload Your Resume</h1>
      <div
        {...getRootProps()}
        className={`flex items-center justify-center w-full h-64 border-2 rounded-lg cursor-pointer 
          ${isDragActive ? 'border-blue-500' : isDragReject ? 'border-red-500' : 'border-gray-300'} 
          border-dashed`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-gray-700">Drop the files here ...</p>
        ) : (
          <p className="text-gray-700">Drag 'n' drop your resume here, or click to select it</p>
        )}
      </div>
      {uploading && <p className="text-blue-500">Uploading...</p>}
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  );
};

export default UploadResume;
