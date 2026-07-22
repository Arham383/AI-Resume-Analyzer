"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadBox() {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFileName(acceptedFiles[0].name);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    onDrop,
  });

  const analyzeResume = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setResult(
        "✅ ATS Score: 85/100\n\n✔ Skills Found: HTML, CSS, JavaScript, React\n\n💡 Suggestion: Add more projects and improve your resume summary."
      );
    }, 2000);
  };

  return (
    <div className="mt-8">
      <label
        {...getRootProps()}
        className="block border-2 border-dashed border-blue-400 rounded-xl p-10 text-center cursor-pointer hover:bg-blue-50 transition"
      >
        <input {...getInputProps()} />

        <h3 className="text-xl font-semibold text-blue-700">
          📄 Upload Resume
        </h3>

        <p className="mt-2 text-gray-600">
          Click here to choose your PDF
        </p>

        {fileName && (
          <p className="mt-4 text-green-600 font-semibold">
            ✅ {fileName}
          </p>
        )}
      </label>

      {fileName && (
        <button
          type="button"
          onClick={analyzeResume}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      )}

      {result && (
        <div className="mt-6 p-4 bg-green-200 text-black font-medium rounded-lg text-left whitespace-pre-line">
          {result}
        </div>
      )}
    </div>
  );
}