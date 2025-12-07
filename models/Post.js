const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", 
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

    tags: {
      type: String,
      default: "",
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
