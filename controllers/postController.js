const Post = require("../models/Post");
const Student = require("../models/Student");
const { multer, uploadFileToGCS } = require("../utils/uploadHelper");

// Multer middleware for optional image upload
const uploadPostImageMiddleware = multer.single("image");

const createPost = async (req, res) => {
  try {
    const { userId, postName, description, tags } = req.body;

    if (!userId || !postName || !description) {
      return res.status(400).json({
        success: false,
        message: "userId, postName, and description are required",
      });
    }

    const student = await Student.findById(userId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    let imageUrl = "";

    // Optional Image Upload
    if (req.file) {
      const allowedFormats = [
        "image/bmp",
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedFormats.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Invalid image format. Allowed: BMP, GIF, JPEG, PNG, WebP",
        });
      }

      imageUrl = await uploadFileToGCS(req.file);
    }

    let tagsArray = [];
    if (tags) {
      try {
        tagsArray = JSON.parse(tags); 
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Tags must be a valid JSON array",
        });
      }
    }

    // Create new post
    const newPost = new Post({
      userId,
      postName,
      description,
      uploadTime: Date.now(),
      tags: tagsArray,
      imageUrl,
    });

    await newPost.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
        post: newPost,

    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while creating post",
      error: error.message,
    });
  }
};


const getPosts = async (req, res) => {
  try {
    const {
      searchText,
      startDate,
      endDate,
      tags,
      page = 1,
      limit = 10
    } = req.query;

    

    const filter = {};

    //Search text in postName or description
    if (searchText) {
      filter.$or = [
        { postName: { $regex: searchText, $options: "i" } },
        { description: { $regex: searchText, $options: "i" } }
      ];
    }

    //Date range filter
    if (startDate || endDate) {
      filter.uploadTime = {};
      if (startDate) filter.uploadTime.$gte = new Date(startDate);
      if (endDate) filter.uploadTime.$lte = new Date(endDate);
    }

    // Tag filter
    if (tags) {
      let parsedTags = [];

      try {
        parsedTags = JSON.parse(tags); 
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid tags format. Expected JSON array string."
        });
      }

      filter.tags = { $in: parsedTags };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const posts = await Post.find(filter)
      .sort({ uploadTime: -1 })
      .skip(skip)
      .limit(Number(limit));

    console.log("Post Filter Response:", posts);

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      page: Number(page),
      limit: Number(limit),
      total: posts.length,
      posts
    });

  } catch (error) {
    console.error("Fetch Posts Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching posts",
      error: error.message
    });
  }
};


module.exports = {
  uploadPostImageMiddleware,
  createPost,
  getPosts
};
