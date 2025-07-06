const express = require("express");
const { Course, Enrollment, Video } = require("../config/db");
const { optionalAuth, auth } = require("../middleware/auth");
const router = express.Router();
const cloudinary = require("../config/cloudinary");

router.get("/browse", async (req, res) => {
  try {
    const courses = await Course.find()
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
      "email"
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
        createdBy: course.createdBy,
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

    const videos = await Video.find({ courseId }).sort({ videoOrder: 1 });

    const videosWithUrls = videos.map((video) => {
      const isAccessible = isEnrolled || video.isPublic;

      return {
        id: video._id,
        title: video.title,
        description: video.description,
        duration: video.duration,
        videoOrder: video.videoOrder,
        isPublic: video.isPublic,
        locked: !isAccessible,

        ...(isAccessible && {
          directUrl: video.cloudinaryUrl,
          streamingUrl: cloudinary.url(video.cloudinaryId, {
            resource_type: "video",
            format: "mp4",
          }),
          cloudinaryId: video.cloudinaryId,
        }),

        ...(!isAccessible && {
          message: "Enroll to access this video",
        }),
      };
    });

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
    console.error("Error fetching course videos:", error);
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

router.post("/enroll/:courseId", auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const alreadyEnrolled = await Enrollment.findOne({ courseId, userId });
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const enrollment = new Enrollment({ courseId, userId });
    await enrollment.save();

    res.status(201).json({ message: "Enrolled successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/enrolled-courses", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "courseId",
        populate: {
          path: "createdBy",
          select: "name email",
        },
      });

    const courses = enrollments.map((enroll) => {
      const course = enroll.courseId;
      return {
        id: course._id,
        title: course.title,
        description: course.description,
        createdBy: course.createdBy,
        price: course.price,
        enrollmentDate: enroll.createdAt,
      };
    });

    res.json({ enrolledCourses: courses });
  } catch (error) {
    console.error("Failed to fetch enrolled courses", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = {
  userRouter: router,
};
