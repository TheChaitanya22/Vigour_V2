const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const { Video, Course, Enrollment } = require("../config/db");
const { auth, isCoach } = require("../middleware/auth");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const streamifier = require("streamifier");

router.post("/courses", auth, isCoach, async (req, res) => {
  try {
    const { title, description, price } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const newCourse = new Course({
      title,
      description,
      price: price || 0,
      createdBy: req.user.id,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json({ courseId: savedCourse._id });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.post("/upload", auth, upload.single("videoFile"), async (req, res) => {
  try {
    const { title, description, courseId, videoOrder, isPublic } = req.body;
    console.log(courseId);
    const course = await Course.findOne({
      _id: courseId,
      createdBy: req.user.id,
    });

    if (!course) {
      return res.status(403).json({
        message: "Course not found or you don't have permission",
      });
    }

    const isVideoPublic = isPublic === "true" || isPublic === true;
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
          courseId,
          isPublic: isVideoPublic,
          videoOrder: parseInt(videoOrder),
          cloudinaryId: result.public_id,
          cloudinaryUrl: result.secure_url,
          uploadedBy: req.user.id,
          duration: result.duration,
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
});

router.get("/my-courses", auth, isCoach, async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });

    // Add stats for each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const videoCount = await Video.countDocuments({ courseId: course._id });
        const enrollmentCount = await Enrollment.countDocuments({
          courseId: course._id,
        });

        return {
          ...course._doc,
          videoCount,
          enrollmentCount,
        };
      })
    );

    res.json(coursesWithStats);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/courses/:courseId/videos", auth, isCoach, async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      createdBy: req.user.id,
    });

    if (!course) {
      return res.status(403).json({
        message: "Course not found or access denied",
      });
    }

    const videos = await Video.find({
      courseId: req.params.courseId,
    }).sort({
      videoOrder: 1,
    });

    const videosWithUrls = videos.map((video) => ({
      ...video._doc,
      directUrl: video.cloudinaryUrl,
      streamingUrl: cloudinary.url(video.cloudinaryId, {
        resource_type: "video",
        streaming_profile: "full_hd",
        format: "m3u8",
      }),
    }));

    res.json({
      course: {
        id: course._id,
        title: course.title,
        description: course.description,
      },
      videos: videosWithUrls,
      totalVideos: videos.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

router.get("/videos/:videoId", auth, isCoach, async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId).populate(
      "courseId",
      "title createdBy"
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Check if coach owns the course
    if (video.courseId.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const videoWithUrls = {
      ...video._doc,
      directUrl: video.cloudinaryUrl,
      streamingUrl: cloudinary.url(video.cloudinaryId, {
        resource_type: "video",
        streaming_profile: "full_hd",
        format: "m3u8",
      }),
    };

    res.json({
      video: videoWithUrls,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.put("/videos/:videoId", auth, isCoach, async (req, res) => {
  try {
    const { title, description, videoOrder, isPublic } = req.body;

    const video = await Video.findById(req.params.videoId).populate(
      "courseId",
      "createdBy"
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Check if coach owns the course
    if (video.courseId.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Update video
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.videoId,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(videoOrder && { videoOrder: parseInt(videoOrder) }),
        ...(isPublic !== undefined && {
          isPublic: isPublic === "true" || isPublic === true,
        }),
      },
      { new: true }
    );

    res.json({
      message: "Video updated successfully",
      video: updatedVideo,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Delete video
router.delete("/videos/:videoId", auth, isCoach, async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId).populate(
      "courseId",
      "createdBy"
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Check if coach owns the course
    if (video.courseId.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(video.cloudinaryId, {
        resource_type: "video",
      });
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError);
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete from database
    await Video.findByIdAndDelete(req.params.videoId);

    res.json({
      message: "Video deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Get course analytics
router.get("/courses/:courseId/analytics", auth, isCoach, async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      createdBy: req.user.id,
    });

    if (!course) {
      return res.status(403).json({
        message: "Course not found or access denied",
      });
    }

    const videos = await Video.find({ courseId: req.params.courseId });
    const enrollments = await Enrollment.find({
      courseId: req.params.courseId,
    }).populate("userId", "name email");

    const analytics = {
      course: {
        id: course._id,
        title: course.title,
        createdAt: course.createdAt,
      },
      stats: {
        totalVideos: videos.length,
        publicVideos: videos.filter((v) => v.isPublic).length,
        privateVideos: videos.filter((v) => !v.isPublic).length,
        totalDuration: videos.reduce((sum, v) => sum + (v.duration || 0), 0),
        totalEnrollments: enrollments.length,
      },
      recentEnrollments: enrollments
        .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
        .slice(0, 10),
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = {
  creatorRouter: router,
};
