const mongoose =   require("mongoose");

const postShema = new mongoose.Schema({
  author: {
    type : mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  media: [
    {
      type: String,
    },
  ],
  caption: {
    type: String,
  },
  like: [
    {
    type : mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
},{
  timestamps :true
});

const Post = mongoose.model("Post", postShema);

module.exports =  Post;
