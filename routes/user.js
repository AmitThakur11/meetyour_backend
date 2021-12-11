const route = require('express').Router()
const {follow , blockUser , changeProfilePic , editProfile , showProfile , userProfile , allUsers} = require("../controller/user");
const tokenVerify = require('../middleware/tokenVerify');
const {userParam} = require("../middleware/getParam");

route.get("/all",allUsers)
route.use(tokenVerify);

route.post("/changepic",changeProfilePic);
route.post("/editprofile",editProfile);
route.get("/userProfile",userProfile)
route.param("userId" , userParam);
route.get("/profile/:userId",showProfile);
route.post("/follow/:userId",follow)
route.post("/block/:userId",blockUser)


module.exports = route