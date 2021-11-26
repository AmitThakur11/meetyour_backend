const { setResponse } =  require("../utils")
const User =  require("../models/user");

const follow = async (req, res) => {
  try {
    const userId = req.user;
    const userToFollowId = req.userParam;

    let user = await User.findById(userId);
    let userToFollow = await User.findById(userToFollowId);
    const isBlocked = await userToFollow.blockList.find(({blockUser})=>blockUser === user._id)
    if(isBlocked){
        return setResponse(res,400,"You are blocked by the user")
    }
    const alreadyFollowed = await user.following.find(
      (user) => user === userToFollowId
    );
    if (alreadyFollowed) {
      user = await user.following.pull(userToFollowId);
      userToFollow = await userToFollow.followers.pull(userId);
      user.save();
      userToFollow.save();
      return setResponse(res, 200, "Unfollowed", user);
    }

    user = await user.following.unshift(userToFollowId);
    userToFollow = await userToFollow.followers.unshift(userId);
    user.save();
    userToFollow.save();
    setResponse(res, 200, "Followed", user);
  } catch (err) {
    setResponse(res, err.status, err.message);
  }
};

const blockUser = async (req, res) => {
  const userToBlockId = req.userParam;
  const userId = req.user;
  let user = await User.findById(userId);
  const alreadyBlock = await user.following.find(
    (user) => user === userToFollowId
  );
  if (alreadyBlock) {
    user = await user.blockList.pull(userToBlockId);
    user.save();
    return setResponse(res, 200, "User blocked", user);
  }
  user = await user.blockList.unshift(userToBlockId);
  user.save();
  setResponse(res, 200, "User blocked", user);
};

module.exports = { follow , blockUser };
