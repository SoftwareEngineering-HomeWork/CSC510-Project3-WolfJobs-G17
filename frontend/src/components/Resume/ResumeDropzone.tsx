import React, { useCallback } from 'react';
import { useDropzone, DropzoneOptions, FileRejection } from 'react-dropzone';

interface ResumeDropzoneProps {
  onFileUpload: (acceptedFiles: File[]) => void; // Define the type here
}

const ResumeDropzone: React.FC<ResumeDropzoneProps> = ({ onFileUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // Pass the accepted files to the parent component
      onFileUpload(acceptedFiles);

      // Handle any file rejections
      fileRejections.forEach((file) => {
        console.error(`File rejected: ${file.file.name}`);
      });
    },
    [onFileUpload]
  );

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 15 * 1024 * 1024, // 15 MB limit
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  return (
    <div {...getRootProps()} className="flex items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-gray-700">Drop the files here ...</p>
      ) : (
        <p className="text-gray-700">Drag 'n' drop your resume here, or click to select it</p>
      )}
    </div>
  );
};

export default ResumeDropzone;
