const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const { Video } = require("../config/db");
const { auth, isCoach } = require("../middleware/auth");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const streamifier = require("streamifier");

router.post(
  "/upload",
  auth,
  isCoach,
  upload.single("videoFile"),
  async (req, res) => {
    try {
      const { title, description, isPublic } = req.body;

      // Access the file from memory
      const videoBuffer = req.file.buffer;

      // Create a readable stream from the buffer
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video", // Specify that it's a video
          folder: "coaching-videos", // Cloudinary folder
        },
        async (error, result) => {
          if (error) {
            return res
              .status(500)
              .json({ message: "Error uploading video", error: error.message });
          }
          console.log("req.user:", req.user);
          // Create new video in the database
          const newVideo = new Video({
            title,
            description,
            cloudinaryId: result.public_id,
            cloudinaryUrl: result.secure_url,
            uploadedBy: req.user.id,
            isPublic,
          });

          // Save video info to the database
          const savedVideo = await newVideo.save();
          res.status(201).json(savedVideo);
        }
      );

      // Pipe the video buffer to the upload stream
      streamifier.createReadStream(videoBuffer).pipe(stream);
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
