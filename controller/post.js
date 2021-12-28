const Post =  require("../models/post");
const User =  require("../models/user");
const { setResponse , cloudinary } =  require("../utils");

const allPost = async (req, res) => {
  try {
    const userId = req.user;
    //   Post.find({}).populate(
    //   [
    //     {path : "comments" , populate : [{path : "author" , select :"username displayPic"}]},
    //     {path : "author" , select :"username displayPic"},
    //     {path : "like", select :"username displayPic"}
    //   ]
    // ).sort({ createdAt: 'desc'}).exec(async(err,docs) =>{
    //   if(err)throw err
       
     
    //   setResponse(res, 200, "post fetched", docs);

    // })

    const  user = await User.findById(userId).populate([{
      path : "following" , populate : {path : "post" , populate : [
        {path : "comments" , populate : [{path : "author" , select :"username displayPic"}]},
        {path : "author" , select :"username displayPic"},
        {path : "like", select :"username displayPic"}
      ]}
    },{path : "post" , populate : [
      {path : "comments" , populate : [{path : "author" , select :"username displayPic"}]},
      {path : "author" , select :"username displayPic"},
      {path : "like", select :"username displayPic"}
    ]}])
    
    
    let postData = await user.following.map(({post})=>post).flat()
    postData = postData.concat(user.post)
    postData = await postData.sort((a,b)=>{
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    setResponse(res,200,"post fetched", postData)
    
  } catch (err) {
    setResponse(res, 500, err.message);
  }
};

const showPost = async (req, res) => {

  const postId = req.postId;
  try {
     await Post.findById(postId).populate(
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
    if (!caption) {
      return setResponse(res, 400, "Caption needed");
    }
    
    let upload =  await cloudinary.uploader.upload(media[0],{
      upload_preset : "z0t3ezb4"
    })

    const user = await User.findById(userId);
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
      author.savePost.pull(postId)
      await author.save()

      const post = await Post.findById(postId)
      if(post.author.toHexString() !== user._id){
        return setResponse(res,400,"Invalid access")
    }
      await Post.findByIdAndRemove({_id : postId},(err,docs)=>{
        if(err)throw err
       
          return setResponse(res,200,"Post deleted" , author)
        
        
        
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
        console.log("posId",postId)
        console.log("user",user.savePost)
        
        let msg = ""
        const isSaved = user.savePost.find((item)=>item.toHexString() === postId);
        if(isSaved){
          user.savePost.pull(postId);
          msg = "Post removed from saved"
          await user.save()
          const populateData = await user.populate({path : "savePost" , select : "media "})
          return setResponse(res,200,msg, populateData.savePost)
  
         
        }else{
          user.savePost.push(postId);
          msg = "Post saved"
          await user.save()
          const populateData = await user.populate({path : "savePost" , select : "media "})
          return setResponse(res,200,msg, populateData.savePost)
  
         
        }
      
       
    }catch(err){
        setResponse(res,500,err.message)
    }
}


module.exports ={ allPost, addPost , likePost , deletePost , editCaption ,savePost , showPost};
