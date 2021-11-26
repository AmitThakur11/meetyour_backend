const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      ref: "User",
    },
    post: {
      type: String,
      ref: "Post",
    },
    comment: {
      type: String,
    },
    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timeStamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports =  Comment;
