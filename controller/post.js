const Post =  require("../models/post");
const User =  require("../models/user");
const { setResponse } =  require("../utils");
const mongoose = require('mongoose')

const allPost = async (req, res) => {
  try {
    // let userId = req.user
    // let user = await User.findById(userId);
    // const allPost = await Post.find({});
     await Post.find({}).populate(
      [
        {path : "comments" , populate : [{path : "author" , select :"username displayPic"}]},
        {path : "author" , select :"username displayPic"},
        {path : "like",populate : [{path : "author" , select :"username displayPic"}]}
      ]
    ).exec((err,docs)=>{
      if(err)throw err
      setResponse(res, 200, "post fetched", docs);

    })
    
  } catch (err) {
    setResponse(res, 500, err.message);
  }
};
const addPost = async (req, res) => {
  try {
    const { caption, media } = req.body;
    let userId = req.user;
    if (!caption) {
      return setResponse(res, 400, "Caption needed");
    }
    const user = await User.findById(userId);
    const newPost = await new Post({ author : user._id , caption, media });
    await newPost.save();
    await user.post.unshift(newPost._id);
    user.save();
    setResponse(res, 200, "post uploaded successfully");
  } catch (err) {
    setResponse(res, 500, err.message);
  }
};

const likePost = async (req, res) => {
  const postId = req.postId;
  const user = req.user;
  try {
    const post = await Post.findById(postId);


    if (!post) {
      return setResponse(res, 400, "post unavailable");
    }

    
    const liked = post.like.find((id) => id === user._id);
    if(liked) {
      await post.like.pull(user);
      post.save();
      return setResponse(res, 200, "post unliked", post);
    }

    await post.like.unshift(user);
    await post.save();
    setResponse(res, 200, "post liked", post);
  } catch (err) {
    setResponse(res,500, err.message);
  }
};





const deletePost = async(req,res)=>{
    try{

      const postId = req.postId;
      const user = req.user;
      let  author = await User.findById(user._id);
      author.post.pull(postId)
      await author.save()

      const post = await Post.findById(postId)
      if(post.author.toHexString() !== userId._id){
        return setResponse(res,400,"Invalid access")
    }
      const populatedData =  await author.populate("post post.like post.comments");
      await Post.findByIdAndRemove({_id : postId},(err,docs)=>{
        if(err){
          throw err
        }
        else{
          setResponse(res,200,populatedData)
        }
        
        
      }).clone()
      
      
       
    }catch(err){
        setResponse(res ,500,err.message)
    }
}

const editCaption = async(req,res)=>{
    try{
        const {caption} = req.body;
        const userId = req.user;
        const postId = req.postId;

        const post = await Post.findById(postId)
        if(post.author.toHexString() !== userId._id){
          return setResponse(res,400,"Invalid access")
      }
        await Post.findByIdAndUpdate(postId,{caption : caption},(err,docs)=>{
          if(err){
            throw err
          }
          else{
            console.log(docs)
            return setResponse(res,200,docs)
          }
          
          
        }).clone()
        

    }catch(err){
        setResponse(res ,500,err.message)     
    }
}

const savePost = async(req,res)=>{
    try{
        const postId = req.postId;
        const userId =req.user;
        const user = await User.findById(userId);
        const isSaved = user.savePost.find((item)=>item.toHexString() === postId);
        if(isSaved){
          user.savePost.pull(postId);
        }else{
          user.savePost.unshift(postId);

        }
      
        await user.save()
        setResponse(res,200,"Post saved")

    }catch(err){
        setResponse(res,500,err.message)
    }
}


module.exports ={ allPost, addPost , likePost , deletePost , editCaption ,savePost};
