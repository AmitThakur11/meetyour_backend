const { setResponse } =  require("../utils")
const User =  require("../models/user");

const follow = async (req, res) => {
  try {
    const userId = req.user;
    const userToFollowId = req.userId;
    let user = await User.findById(userId);
    let userToFollow = await User.findById(userToFollowId);
    
    const isBlocked = await userToFollow.blockList.find((blockUser)=>blockUser.toHexString() === userId._id );
    if(isBlocked){
        return setResponse(res,400,"You are blocked by the user")
    }
    const alreadyFollowed = await user.following.find((user) => user.toHexString() === userToFollowId);
    if (alreadyFollowed) {
      await user.following.pull(userToFollowId);
      await user.save();

      await userToFollow.followers.pull(userId);
      await userToFollow.save();

      return setResponse(res, 200, "Unfollowed", user);
    }

    await user.following.unshift(userToFollowId);
    await user.save();


    await userToFollow.followers.unshift(userId);
    
    await userToFollow.save();
    setResponse(res, 200, "Followed", user);
  } catch (err) {
    setResponse(res, 500, err.message);
  }
};

const blockUser = async (req, res) => {
  const userToBlockId = req.userId;
  const userId = req.user;
  try{
    let user = await User.findById(userId);
    const alreadyBlock = await user.blockList.find((user) => user.toHexString() === userToBlockId);
    console.log(alreadyBlock)
  if(alreadyBlock) {
    console.log("aaya")
    await user.blockList.pull(userToBlockId);
    await user.save();
    return setResponse(res, 200, "User unBlocked", user);
  }
  await user.blockList.unshift(userToBlockId);
  await user.save();
  setResponse(res, 200, "User blocked", user);
  }
  catch(err){
    setResponse(res,500,err.message)
  }
};


const changeProfilePic = async(req,res)=>{
  const user = req.user;
  const {displayPic} = req.body;

  try{
    await User.findByIdAndUpdate(user._id,{displayPic : displayPic},(err,docs)=>{
      if(err) throw err
      else{
        console.log(docs)
        setResponse(res,200,"profile pic update",docs)
      }
    }).clone()

  }catch(err){
    setResponse(res,500,err.message)
  }

}


const editProfile = async(req,res)=>{
  try{
    const user = req.user;
    const updateData = req.body;
    
    await User.findByIdAndUpdate(user._id,updateData,(err,docs)=>{
      if(err) throw err
      else{
        console.log(docs)
        setResponse(res,200,"profile updated",docs)
      }
    }).clone()

  }catch(err){
    setResponse(rs,500,err.message)
  }
}

module.exports = { follow , blockUser , changeProfilePic , editProfile};
