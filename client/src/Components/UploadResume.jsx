import { CheckCircle, Upload, FileText, Sparkles } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";

export default function UploadResume({ formData, handleFileUpload }) {
  const [fileURL, setFileURL] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      handleFileUpload(file);
      setFileURL(URL.createObjectURL(file));
    },
    [handleFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    multiple: false,
  });

  useEffect(() => {
    return () => {
      if (fileURL) URL.revokeObjectURL(fileURL);
    };
  }, [fileURL]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Upload Your Resume</h2>
      </div>

      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 p-6 h-60 text-center rounded-xl cursor-pointer flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition"
      >
        <input {...getInputProps()} required disabled={fileURL} />

        {formData.resumeFile ? (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <p className="text-lg font-medium text-gray-900">
              {formData.resumeFile.name}
            </p>
            <p className="text-green-600 font-medium">
              Resume uploaded successfully!
            </p>
            <button
              type="button"
              onClick={() => {
                setFileURL(null)
                handleFileUpload(null)}}
              className="mt-2 text-blue-600 hover:text-blue-700 underline"
            >
              Upload different file
            </button>
          </div>
        ) : isDragActive ? (
          <div className="space-y-4">
            <p className="text-gray-600">Drop the file here ...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-16 h-16 text-gray-400 mx-auto" />
            <p className="text-lg font-medium text-gray-900">
              Upload your resume *
            </p>
            <p className="text-gray-600">
              Drag & drop here, or click to browse
            </p>
            <p className="text-sm text-gray-500">Supported: PDF, DOC, DOCX</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-800">
            <strong>Pro Tip:</strong> A well-formatted resume helps our AI
            provide better job recommendations and career insights tailored to
            your experience.
          </p>
        </div>
      </div>
    </div>
  );
}
