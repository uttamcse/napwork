const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",   // Reference to Student Schema
      required: true,
    },

    postName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    uploadTime: {
      type: Date,
      default: Date.now,
    },

    tags: {
      type: [String],   // Array of Strings
      default: [],
    },

    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
