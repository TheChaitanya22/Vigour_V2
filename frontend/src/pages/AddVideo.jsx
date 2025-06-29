import React, { useState } from "react";
import axios from "axios";
import {
  Upload,
  Video,
  FileText,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";
function AddVideo() {
  const { courseId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoOrder, setVideoOrder] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleVideoUpload = async () => {
    if (!videoFile) {
      alert("Please select a video");
      return;
    }

    if (!title.trim() || !description.trim() || !videoOrder) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("courseId", courseId);
    formData.append("videoOrder", videoOrder);
    formData.append("isPublic", isPublic);

    try {
      const response = await axios.post(
        "http://localhost:3000/creator/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        const data = response.data;
        console.log("Uploaded successfully:", data);
        setUploadStatus("success");

        // Reset form after successful upload
        setTimeout(() => {
          setTitle("");
          setDescription("");
          setVideoFile(null);
          setVideoOrder("");
          setIsPublic(true);
          setUploadStatus(null);
        }, 2000);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("video/")) {
        alert("Please select a valid video file");
        return;
      }

      // Validate file size (100MB limit)
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size must be less than 100MB");
        return;
      }

      setVideoFile(file);
      setUploadStatus(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-blue-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Upload Video
                </h1>
                <p className="text-gray-600 text-sm">
                  Add a new video to your course
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12 ">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h2 className="text-xl font-semibold text-white">Video Details</h2>
            <p className="text-blue-100 text-sm mt-1">
              Fill in the information and upload your video
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            {/* Video Title */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                Video Title *
              </label>
              <input
                type="text"
                id="title"
                placeholder="Enter video title..."
                className="w-full px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Video Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                Description *
              </label>
              <textarea
                id="description"
                placeholder="Describe what this video covers..."
                rows={4}
                className="w-full px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Video Order */}
            <div className="space-y-2">
              <label
                htmlFor="videoOrder"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Video className="w-4 h-4 text-blue-600" />
                Video Order *
              </label>
              <input
                type="number"
                id="videoOrder"
                placeholder="1"
                min="1"
                className="w-full px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                value={videoOrder}
                onChange={(e) => setVideoOrder(e.target.value)}
                required
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Upload className="w-4 h-4 text-blue-600" />
                Video File *
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                  videoFile
                    ? "border-green-300 bg-green-50"
                    : "border-blue-300 bg-blue-50/50 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {videoFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-10 h-10 text-green-600 mx-auto" />
                    <p className="font-medium text-green-800">
                      {videoFile.name}
                    </p>
                    <p className="text-sm text-green-600">
                      {formatFileSize(videoFile.size)}
                    </p>
                    <p className="text-xs text-green-500">
                      Click to change file
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Video className="w-10 h-10 text-blue-600 mx-auto" />
                    <p className="text-gray-700 font-medium">
                      Click to select video
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports MP4, MOV, AVI (Max 100MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Public/Private Toggle */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                {isPublic ? (
                  <Eye className="w-4 h-4 text-blue-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-blue-600" />
                )}
                Video Visibility
              </label>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Make this video public
                  </span>
                </label>
              </div>
              <p className="text-xs text-gray-500">
                {isPublic
                  ? "This video will be visible to all users"
                  : "This video will only be visible to enrolled students"}
              </p>
            </div>

            {/* Status Messages */}
            {uploadStatus === "success" && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  Video uploaded successfully!
                </span>
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">
                  Upload failed. Please try again.
                </span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={handleVideoUpload}
                disabled={loading || !videoFile}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading Video...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Video
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddVideo;
