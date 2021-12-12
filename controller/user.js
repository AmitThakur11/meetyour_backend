const { setResponse } = require("../utils");
const User = require("../models/user");
const {cloudinary} = require('../utils')
const allUsers = async(req,res)=>{
  try{
    await User.find({})
    .populate([
      { path: "followers", select: "username displayPic" },
      { path: "following", select: "username displayPic" },
      {
        path: "post",
        populate: [
          { path: "like", select: "username displayPic" },
          { path: 'comments', select: "username displayPic" },
        ],
      },
    ])
    .exec((err, docs) => {
      if (err) throw err;
      setResponse(res, 200, "user fetched", docs);
    });

  }catch(err){
    setResponse(res,500,err.message)
  }

}
const userProfile = async (req, res) => {
  try {
    const userId = req.user;
    await User.findById(userId)
      .populate([
        { path: "followers", select: "username displayPic" },
        { path: "following", select: "username displayPic" },
        {
          path: "post",
          populate: [
            { path: "like", select: "username displayPic" },
            { path: 'comments', populate : "author" , select: "username displayPic post"  },
          ],
        },
      ])
      .exec((err, docs) => {
        if (err) throw err;
        setResponse(res, 200, "user fetched", docs);
      });
  } catch (err) {
    setResponse(res, 500, err.message);
  }
};
const showProfile = async (req, res) => {
  try {
    const userId = req.userId;
    await User.findById(userId)
      .populate([
        { path: "followers", select: "username displayPic" },
        { path: "following", select: "username displayPic" },
        {
          path: "post",
          populate: [
            { path: "like", select: "username displayPic" },
            { path: 'comments', select: "username displayPic" },
          ],
        },
      ])
      .exec((err, docs) => {
        if (err) throw err;
        setResponse(res, 200, "user fetched", docs);
      });
  } catch (err) {
    setResponse(res, 500, err.message);
  }
};
const follow = async (req, res) => {
  try {
    const userId = req.user;
    const userToFollowId = req.userId;
    let user = await User.findById(userId);
    let userToFollow = await User.findById(userToFollowId);

    const isBlocked = await userToFollow.blockList.find(
      (blockUser) => blockUser.toHexString() === userId._id
    );
    if (isBlocked) {
      return setResponse(res, 400, "You are blocked by the user");
    }
    const alreadyFollowed = await user.following.find(
      (user) => user.toHexString() === userToFollowId
    );
    if (alreadyFollowed) {
      await user.following.pull(userToFollowId);
      await user.save();

      await userToFollow.followers.pull(userId);
      await userToFollow.save();
      user = await user.populate({path : "following" , select : "username displayPic"})
      const userYouFollow = await userToFollow.populate({path : "followers" , select : "username displayPic"})
      return setResponse(res, 200, "Unfollowed", {user , userYouFollow});
    }
    await user.following.unshift(userToFollowId);
    await user.save();

    await userToFollow.followers.unshift(userId);

    await userToFollow.save();
    user = await user.populate({path : "following" , select : "username displayPic"})
    const userYouFollow = await userToFollow.populate({path : "followers" , select : "username displayPic -password"})
    return setResponse(res, 200, "Followed", {user , userYouFollow});

    setResponse(res, 200, "Followed", populateData);
  } catch (err) {
    setResponse(res, 500, err.message);
  }
};

const blockUser = async (req, res) => {
  const userToBlockId = req.userId;
  const userId = req.user;
  try {
    let user = await User.findById(userId);
    const alreadyBlock = await user.blockList.find(
      (user) => user.toHexString() === userToBlockId
    );
    console.log(alreadyBlock);
    if (alreadyBlock) {
      console.log("aaya");
      await user.blockList.pull(userToBlockId);
      await user.save();
      return setResponse(res, 200, "User unBlocked", user);
    }
    await user.blockList.unshift(userToBlockId);
    await user.save();
    setResponse(res, 200, "User blocked", user);
  } catch (err) {
    setResponse(res, 500, err.message);
  }
};

const changeProfilePic = async(req, res)=>{
  const user = req.user;
  const {displayPic} = req.body;

  try {

    const {url} = await cloudinary.uploader.upload(displayPic,{
      upload_preset : "z0t3ezb4"
    })
    await User.findByIdAndUpdate(
      user,
      { displayPic: url },
      (err, docs) => {
        if (err) throw err;
        else {
          console.log(docs);
          setResponse(res, 200, "profile pic update", docs);
        }
      }
    ).clone();

  } catch (err) {

    setResponse(res, 500, err.message);
  }
};


const editProfile = async (req, res) => {
  try {
    const user = req.user;
    const updateData  = req.body;
    console.log(user._id)
    if(updateData.username){
      const isUsernameValid = await User.findOne({username : updateData.username})
      
      if(isUsernameValid){
        console.log(isUsernameValid._id)
        if(isUsernameValid._id.toHexString() !== user._id)
          return setResponse(res,400,"username not available")
      }
    }
    if(updateData.email){
      const isEmailValid = await User.findOne({email : updateData.email})
      if(isEmailValid){
        if(isEmailValid._id.toHexString() !== user._id)
        return setResponse(res,400,"username not available")
      }
    }

    await User.findByIdAndUpdate(user._id, updateData, (err, docs) => {
      if (err) throw err;
      else {
        setResponse(res,200,"Profile updated",updateData)
      }
    }).clone();
    
  } catch (err) {
    setResponse(res, 500, err.message);
  }
};


module.exports = {
  follow,
  blockUser,
  changeProfilePic,
  editProfile,
  showProfile,
  userProfile,
  allUsers
};
