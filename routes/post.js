const express = require('express')
const { allPost, addPost , likePost , deletePost , editCaption } = require("../controller/post")
const tokenVerify = require("../middleware/tokenVerify")
const {postParam} = require("../middleware/getParam")
const route = express.Router();
route.use(tokenVerify)
route.get("/all",allPost);


route.post("/addPost", addPost)

route.param("postId",postParam)
route.post("/like/:postId", likePost)

route.post("/edit/:postId",editCaption)



module.exports =  route