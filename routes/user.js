const route = require('express').Router()
const {follow , blockUser , changeProfilePic , editProfile} = require("../controller/user");
const tokenVerify = require('../middleware/tokenVerify');
const {userParam} = require("../middleware/getParam");

route.use(tokenVerify);
route.post("/changepic",changeProfilePic);
route.post("/editprofile",editProfile)
route.param("userId" , userParam)
route.post("/follow/:userId",follow)
route.post("/block/:userId",blockUser)


module.exports = route