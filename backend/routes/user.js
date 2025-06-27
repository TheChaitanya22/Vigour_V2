const express = require("express");
const { Course, Enrollment, Video } = require("../config/db");
const { optionalAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/browse", async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }) // Only show published courses
      .populate("createdBy", "name email") // Get creator info
      .sort({ createdAt: -1 });

    // Add video count and enrollment count for each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const totalVideos = await Video.countDocuments({
          courseId: course._id,
        });
        const publicVideos = await Video.countDocuments({
          courseId: course._id,
          isPublic: true,
        });
        const enrollmentCount = await Enrollment.countDocuments({
          courseId: course._id,
        });

        return {
          ...course._doc,
          totalVideos,
          publicVideos,
          enrollmentCount,
        };
      })
    );

    res.json({
      message: "Courses fetched successfully",
      courses: coursesWithStats,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

router.get("/browse/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    const course = await Course.findById(courseId).populate(
      "createdBy",
      "name email"
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    let isEnrolled = false;
    if (userId) {
      isEnrolled = await Enrollment.exists({ courseId, userId });
    }

    const totalVideos = await Video.countDocuments({ courseId });
    const publicVideos = await Video.countDocuments({
      courseId,
      isPublic: true,
    });

    res.json({
      course: {
        ...course._doc,
        totalVideos,
        publicVideos,
      },
      isEnrolled: !!isEnrolled,
      canAccessAllVideos: !!isEnrolled,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

router.get("/browse/:courseId/videos", optionalAuth, async (req, res) => {
  try {
    let isEnrolled = false;
    const { courseId } = req.params;
    const userId = req.user?.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (userId) {
      isEnrolled = await Enrollment.exists({
        courseId,
        userId,
      });
    }

    let videos;

    if (isEnrolled) {
      videos = await Video.find({ courseId }).sort({ videoOrder: 1 });
    } else {
      videos = await Video.find({ courseId, isPublic: true }).sort({
        videoOrder: 1,
      });
    }

    const videosWithUrls = videos.map((video) => ({
      id: video._id,
      title: video.title,
      description: video.description,
      duration: video.duration,
      videoOrder: video.videoOrder,
      isPublic: video.isPublic,

      ...(isEnrolled || video.isPublic
        ? {
            directUrl: video.cloudinaryUrl,
            streamingUrl: cloudinary.url(video.cloudinaryId, {
              resourse_type: "video",
              streaming_profile: "full_hd",
              format: "m3u8",
            }),
            cloudinaryId: video.cloudinaryId,
          }
        : {
            locked: true,
            message: "Enroll to access this video",
          }),
    }));

    res.json({
      course: {
        id: course._id,
        title: course.title,
        description: course.description,
      },
      videos: videosWithUrls,
      isEnrolled: !!isEnrolled,
      totalVideos: videos.length,
      accessibleVideos: isEnrolled
        ? videos.length
        : videos.filter((v) => v.isPublic).length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

router.get(
  "/browse/:courseId/videos/:videoId",
  optionalAuth,
  async (req, res) => {
    try {
      const { courseId, videoId } = req.params;
      const userId = req.user?.id;

      const video = await Video.findOne({ _id: videoId, courseId });
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      // Check if user can access this video
      let canAccess = video.isPublic;

      if (!canAccess && userId) {
        const isEnrolled = await Enrollment.exists({ courseId, userId });
        canAccess = !!isEnrolled;
      }

      if (!canAccess) {
        return res.status(403).json({
          message:
            "Access denied. Please enroll in the course to watch this video.",
          requiresEnrollment: true,
        });
      }

      // Return video with URLs
      const videoWithUrls = {
        id: video._id,
        title: video.title,
        description: video.description,
        duration: video.duration,
        videoOrder: video.videoOrder,
        directUrl: video.cloudinaryUrl,
        streamingUrl: cloudinary.url(video.cloudinaryId, {
          resource_type: "video",
          streaming_profile: "full_hd",
          format: "m3u8",
        }),
        cloudinaryId: video.cloudinaryId,
      };

      res.json({
        video: videoWithUrls,
        canAccess: true,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server Error",
        error: error.message,
      });
    }
  }
);

// Search courses
router.get("/search", async (req, res) => {
  try {
    const { q, category, level } = req.query;

    let searchQuery = { isPublished: true };

    if (q) {
      searchQuery.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (category) {
      searchQuery.category = category;
    }

    if (level) {
      searchQuery.level = level;
    }

    const courses = await Course.find(searchQuery)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      courses,
      total: courses.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = {
  userRouter: router,
};
