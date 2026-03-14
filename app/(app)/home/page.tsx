"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";
function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error(" Unexpected response format");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-lg">
        Loading videos...
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center py-10 md:py-16 bg-gradient-to-b from-gray-50 to-white rounded-xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-base-content">
          Welcome to Cloud Video Management Platform
        </h1>

        <p className="text-base-content/80 max-w-full md:max-w-2xl mx-auto">
          This SaaS application allows users to upload, manage, and download
          videos using cloud storage. Powered by Cloudinary, it provides secure
          media storage, optimized delivery, and easy video management through a
          simple dashboard.
        </p>

        {/* Features */}
       
      {/* Features */}
<div className="mt-10 px-4 md:px-8">
  <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

    <div className="text-center p-6 bg-base-200 rounded-xl shadow-md hover:shadow-lg transition-all">
      Secure Cloud Storage
    </div>

    <div className="text-center p-6 bg-base-200 rounded-xl shadow-md hover:shadow-lg transition-all">
      Fast Video Upload
    </div>

    <div className="text-center p-6 bg-base-200 rounded-xl shadow-md hover:shadow-lg transition-all">
      Easy Video Management
    </div>

  </div>
        </div>
        </div>

      {/* Videos Section */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Available Videos
      </h2>

      {error && <div className="text-center text-red-500 mb-4">{error}</div>}

      {videos.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          No videos available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
