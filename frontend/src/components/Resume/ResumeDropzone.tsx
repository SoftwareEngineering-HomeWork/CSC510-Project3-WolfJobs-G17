import React, { useCallback, useState } from "react";
import { useDropzone, DropzoneOptions, FileRejection } from "react-dropzone";

interface ResumeDropzoneProps {
  onFileUpload: (acceptedFiles: File[]) => void; // Define the type here
}

const ResumeDropzone: React.FC<ResumeDropzoneProps> = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // Set the name of the uploaded file
      if (acceptedFiles.length > 0) {
        setFileName(acceptedFiles[0].name);
      } else {
        setFileName(null); // Clear the filename if no file is accepted
      }

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

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone(dropzoneOptions);

  return (
    <div>
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
      >
        <input {...getInputProps()} type="file" />
        {isDragActive ? (
          <p className="text-gray-700">Drop the files here ...</p>
        ) : (
          <p className="text-gray-700">
            Drag 'n' drop your resume here, or click to select it
          </p>
        )}
        {fileName && <p className="mt-2 text-gray-600">File: {fileName}</p>}
      </div>
    </div>
  );
};

export default ResumeDropzone;