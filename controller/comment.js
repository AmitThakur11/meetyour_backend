const Comment = require("../models/comment")
const Post = require("../models/post")
const User = require("../models/user")
const {setResponse} = require("../utils")


const addComment = async (req, res) => {
    try {
      const { commentText } = req.body;
      const userId = req.user;
      const postId = req.postParam;
      const post = await Post.findById(postId);
      const postUser = await User.findById(post.author);
      const isBlocked = await postUser.blockList.find((blockUser)=>blockUser === userId)
      if(isBlocked){
          return setResponse(res,400,"blocked by user")
      }
      const newCommment = new Commment({
        author: userId,
        post: postId,
        commentText,
      });
      await newCommment.save();
      await post.comments.unshift(newCommment._id);
      await post.save();
      setResponse(res, 200, "Comment added", newComment);
    } catch (err) {
      setResponse(res, err.status, err.message);
    }
  };
  
  const getComment = async (req, res) => {
    try {
      const postId = req.postParam;
      const comments = await Comment.find({ post: postId });
      setResponse(res, 200, "post comment", comments);
    } catch (err) {
      setResponse(res, err.status, err.message);
    }
  };
  
  const deleteComment = async (req,res)=>{
      try{
          const commentId = req.commentParam;
          const postId = req.postParam;
          let user = req.user;
  
  
          let comment = await Commment.findById(commentId);
          let userPost  = await User.findById(user).post.find(({_id})=> _id === postId)
          
          if(postId !==userPost ){
              if(comment.author !== user){
                  return setResponse(res,400,"Action invalid")
              }
  
          }
          comment  = await Comment.filter(({_id})=> _id !== comment._id);
          await comment.save();
          userPost = await userPost.comments.pull(postId);
          await userPost.save();
          setResponse(res,200,"comment removed",{ comment , post : userPost})
  
  
      }catch(err){
          setResponse(res, err.status, err.message);
      }
  }



module.exports = {getComment ,addComment , deleteComment}