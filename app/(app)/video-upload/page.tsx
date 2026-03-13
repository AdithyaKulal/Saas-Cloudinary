"use client";

import React, { useState } from "react";

export default function VideoUploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setError(null);
    setSuccessMessage(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please choose a video file first.");
      return;
    }

    // Front-end safety limit to avoid huge uploads timing out.
    const maxBytes = 25 * 1024 * 1024; // 25 MB
    if (file.size > maxBytes) {
      setError("Video is too large. Please upload a file smaller than 25 MB.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || file.name);
      formData.append("description", description);
      formData.append("originalSize", file.size.toString());

      const response = await fetch("/api/video-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to upload video");
      }

      setSuccessMessage("Video uploaded successfully.");
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to upload video.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 bg-base-200">
      <div className="w-full max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Video Upload
        </h1>

        <div className="card bg-base-100 shadow-lg border">
          <div className="card-body space-y-4">
            <h2 className="card-title text-lg sm:text-xl">
              Upload a new video
            </h2>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="My tutorial video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Short description of the video"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Choose video file</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered file-input-primary w-full"
              />
              {file && (
                <span className="mt-2 text-sm opacity-80 break-all">
                  Selected: {file.name} (
                  {(file.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              )}
            </div>

            {error && (
              <p className="text-error text-sm break-words">{error}</p>
            )}
            {successMessage && (
              <p className="text-success text-sm break-words">
                {successMessage}
              </p>
            )}

            <div className="card-actions mt-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                className="btn btn-primary w-full sm:w-auto"
                onClick={handleUpload}
                disabled={!file || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload video"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
