const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");
const { setResponse } = require("../utils");

const addComment = async (req, res) => {
  try {
    const { commentText } = req.body;
    const userId = req.user;
    const postId = req.postId;
    const post = await Post.findById(postId);
    const postUser = await User.findById(post.author);
    console.log(userId._id);
    console.log(postUser);
    const isBlocked = await postUser.blockList.find(
      (blockUser) => blockUser.toHexString() === userId._id
    );
    console.log(isBlocked);

    if (isBlocked) {
      return setResponse(res, 400, "blocked by user");
    }
    const newComment = await new Comment({
      author: userId,
      post: postId,
      comment: commentText,
    });
    await newComment.save();
    await post.comments.unshift(newComment._id);
    await post.save();
    const populateData = await newComment.populate("author post like");
    setResponse(res, 200, "Comment added", { comment: populateData });
  } catch (err) {
    setResponse(res, 500, err.message);
  }
};

const getComment = async (req, res) => {
  try {
    const postId = req.postId;
    const comments = await Comment.find({ post: postId }).populate(
      "author post like"
    );
    setResponse(res, 200, "All comments", comments);
  } catch (err) {
    setResponse(res, 500, err.message);
  }
};

const deleteComment = async (req, res) => {
  try {
    const postId = req.postId;
    const user = req.user;
    const commentId = req.commentId;

    const comment = await Comment.findById(commentId);
    let post = await Post.findById(postId);
    if(comment.author.toHexString() === user._id || post.author.toHexString()=== user._id) {
      
      await post.comments.pull(commentId);
      await post.save();

      const populatedData = await comment.populate("author post like");
      await Comment.findByIdAndRemove({ _id: commentId }, (err, docs) => {
        if (err) {
          throw err;
        } else {
          setResponse(res, 200, populatedData);
        }
      }).clone();
    } else {
      return setResponse(res, 400, "Invalid access");
    }
  } catch (err) {
    setResponse(res, 500, err.message);
  }
};

const likeComment = async(req,res)=>{
  try{
    const commentId = req.commentId;
    const commentLikedBy = req.user;
    
    const comment = await Comment.findById(commentId);
    const liked = await comment.like.find((id) => id.toHexString() === commentLikedBy._id);
    if(liked) {
      await comment.like.pull(commentLikedBy);
      await comment.save();
      const populatedData = await comment.populate("author post like")
      return setResponse(res, 200, "Unliked this comment", {comment : populatedData});
    }
    await comment.like.unshift(commentLikedBy._id)
    await comment.save()
    const populatedData = await comment.populate("author post like")
    return setResponse(res, 200, "Liked this comment", {comment : populatedData});

  }catch(err){
    setResponse(res, 500, err.message);

  }
  
}

module.exports = { getComment, addComment, deleteComment , likeComment };
