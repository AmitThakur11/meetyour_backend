const Post =  require("../models/post");
const User =  require("../models/user");
const { setResponse } =  require("../utils");

const allPost = async (req, res) => {
  try {
    const allPost = await Post.find({});
    const populatePost = await allPost.populate("comment");
    setResponse(res, 200, "post fetched", populatePost);
  } catch (err) {
    setResponse(res, err.status, err.message);
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
    const newPost = await new Post({ author: caption, media });
    await newPost.save();
    await user.post.unshift(newPost._id);
    user.save();
    setResponse(res, 200, "post uploaded successfully");
  } catch (err) {
    setResponse(res, err.status, err.message);
  }
};

const likePost = async (req, res) => {
  const postId = req.postParam;
  const user = req.user;

  // const user = User.findById(userId);
  try {
    const post = Post.findById(postId);
    if (!post) {
      return setResponse(res, 400, "post unavailable");
    }


    const liked = post.like.find((id) => id === user);
    if (liked) {
      await post.like.pull(user);
      post.save();
      setResponse(res, 200, "post unliked", post);
    }

    await post.like.unshift(user);
    await post.save();
    setResponse(res, 200, "post liked", post);
  } catch (err) {
    setResponse(res, err.status, err.message);
  }
};





const deletePost = async(req,res)=>{
    try{
        const postId = req.postParam;
        const userId = req.user;

        let post = await Post.findById(postId);
        let user = await User.findById(userId);
        if(post.author !== userId){
            return setResponse(res,400,"Invalid access")
        }
        post = await Post.filter(({_id})=>_id !==post._id);
        await post.save();
        user = await user.post.pull((post)=>post===postId);
        user.save();
        setResponse(res,200,"Post removed",post)
    }catch(err){
        setResponse(res ,err.status,err.message)
    }
}

const editCaption = async(req,res)=>{
    try{
        const {caption} = req.body;
        const userId = req.user;
        const postId = req.postParam;

        let post = await Post.find(({_id})=>_id ===postId);
        if(post.author !== userId){
            return setResponse(res,400,"Invalid access")
        }
        post.caption = caption;
        await post.save();
        setResponse(res,200,"Post edited")

    }catch(err){
        setResponse(res ,err.status,err.message)     
    }
}

const savePost = async(req,res)=>{
    try{
        const postId = req.postParam;
        const userId =req.user;

        const user = await User.findById(userId);
        await user.savedPost.unshift(postId);
        await user.save()
        setResponse(res,200,"Post saved")

    }catch(err){
        setResponse(res, err.status,err.message)
    }
}


module.exports ={ allPost, addPost , likePost , deletePost , editCaption };
