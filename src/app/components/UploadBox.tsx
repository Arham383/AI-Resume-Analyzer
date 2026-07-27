"use client";

import { useState } from "react";

interface AnalysisData {
  score: number;
  strengths: string[];
  missingSkills: string[];
  suggestions: string[];
}

export default function UploadBox() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const resData = await response.json();

      if (resData.success) {
        setResult(resData.data);
      } else {
        setError(resData.message || "Failed to analyze resume.");
      }
    } catch (err: any) {
      setError("Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">AI Resume Analyzer</h2>
      
      <div className="mb-4">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Analyzing Resume..." : "Analyze ATS Score"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">ATS Score:</span>
            <span className="text-2xl font-bold text-blue-600">{result.score}/100</span>
          </div>

          <div>
            <h4 className="font-semibold text-green-700 mb-1">Strengths:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {result.strengths?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-amber-700 mb-1">Missing Skills:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {result.missingSkills?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-blue-700 mb-1">Suggestions:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {result.suggestions?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}