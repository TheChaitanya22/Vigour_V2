const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const Video = require("../config/db");
const { auth, isCoach } = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  auth,
  isCoach,
  upload.single("videoData"),
  async (req, res) => {
    try {
      // Upload video to Cloudinary
      const result = await cloudinary.uploader.upload(req.body.videoData, {
        resource_type: "video",
        folder: "coaching-videos",
        max_file_size: 50 * 1024 * 1024,
      });

      // Create new video in database
      const newVideo = new Video({
        title: req.body.title,
        description: req.body.description,
        cloudinaryId: result.public_id,
        cloudinaryUrl: result.secure_url,
        uploadedBy: req.user.id,
        isPublic: req.body.isPublic,
      });

      const savedVideo = await newVideo.save();
      res.status(201).json(savedVideo);
    } catch (error) {
      console.error("Error uploading video:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    const videos = await Video.find({ isPublic: true })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = {
  courseRouter: router,
};
