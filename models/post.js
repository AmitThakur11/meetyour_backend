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
      type: String,
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
  timeStamps :true
});

const Post = mongoose.model("Post", postShema);

module.exports =  Post;
