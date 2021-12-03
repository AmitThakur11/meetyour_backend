const express = require('express')
const { allPost, addPost , likePost , deletePost , editCaption ,savePost } = require("../controller/post")
const tokenVerify = require("../middleware/tokenVerify")
const {postParam} = require("../middleware/getParam");
const { Router } = require('express');
const route = express.Router();
route.get("/all",allPost);
route.use(tokenVerify)



route.post("/addPost", addPost)

route.param("postId",postParam)
route.post("/like/:postId", likePost)
route.delete("/delete/:postId",deletePost)
route.post("/edit/:postId",editCaption)
route.post("/save/:postId",savePost)





module.exports =  route