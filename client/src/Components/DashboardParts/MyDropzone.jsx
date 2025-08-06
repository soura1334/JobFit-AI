import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";

function MyDropzone() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFile = acceptedFiles[0];
    setUploadedFile(pdfFile);
    setFileURL(URL.createObjectURL(pdfFile)); // Generate temporary link
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  return (
    <div className="my-5 flex flex-col gap-5 col-span-2">
      <p className="text-xl font-semibold">Your Resume</p>

      {uploadedFile ? (
        <div
          onClick={() => window.open(fileURL, "_blank")}
          className="w-fit bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg cursor-pointer hover:bg-green-200 transition"
        >
          <strong>{uploadedFile.name}</strong> (click to view)
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-400 p-6 h-50 text-center rounded-xl cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-gray-600">Drop the PDF here ...</p>
          ) : (
            <p className="text-gray-600">
              Drag and drop a PDF file here, or click to select
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default MyDropzone;
