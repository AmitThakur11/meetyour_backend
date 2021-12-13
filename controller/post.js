const Post =  require("../models/post");
const User =  require("../models/user");
const { setResponse , cloudinary } =  require("../utils");

const allPost = async (req, res) => {
  try {
     await Post.find({}).populate(
      [
        {path : "comments" , populate : [{path : "author" , select :"username displayPic"}]},
        {path : "author" , select :"username displayPic"},
        {path : "like", select :"username displayPic"}
      ]
    ).sort({ createdAt: 'desc'}).exec(async(err,docs) =>{
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
    console.log(media)
    if (!caption) {
      return setResponse(res, 400, "Caption needed");
    }
    
    let upload =  await cloudinary.uploader.upload(media[0],{
      upload_preset : "z0t3ezb4"
    })

    const user = await User.findById(userId);
    console.log("yahaan")
    const newPost = await new Post({ author : user._id , caption, media : [upload?.url] });
    await newPost.save();
    await user.post.unshift(newPost._id);
    await user.save();
    await Post.findById(newPost._id).populate([
      {path : "comments" , populate : [{path : "author" , select :"username displayPic"}]},
      {path : "author" , select :"username displayPic"},
      {path : "like", select :"username displayPic"}
    ]
  ).exec((err,docs)=>{
    if(err)throw err
    setResponse(res, 200, "post uploaded sucessfully", docs);

  })
  } catch (err) {
    console.error(err)
    setResponse(res, 500, err.message);
  }
};

const likePost = async (req, res) => {
  const postId = req.postId;
  const user = req.user;
  try {
    let post = await Post.findById(postId);


    if (!post) {
      return setResponse(res, 400, "post unavailable");
    }

    
    const liked = await post.like.find((id) => id.toHexString() === user._id);
    console.log(user._id)
    if(liked) {
      await post.like.pull(user);
      post.save();
      const populateData = await post.populate({path :"like", select : '_id displayPic username'});

      return setResponse(res, 200, "post unliked", populateData);
    }

    await post.like.unshift(user);
    await post.save();
    const populateData = await post.populate({path :"like", select : '_id displayPic username'});
    setResponse(res, 200, "post liked", populateData);
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
            return setResponse(res,200,"Caption updated",docs)
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
        console.log(postId)
        console.log(user.savePost)
        const isSaved = user.savePost.find((item)=>item.toHexString() === postId);
        console.log(isSaved)
        if(isSaved){
          user.savePost.pull(postId);
        }else{
          user.savePost.unshift(postId);

        }
      
        await user.save()
        
        setResponse(res,200,"Post saved", user.savePost)

    }catch(err){
        setResponse(res,500,err.message)
    }
}


module.exports ={ allPost, addPost , likePost , deletePost , editCaption ,savePost};
