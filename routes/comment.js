const router = require('express').Router();
const { getComment ,addComment , deleteComment , likeComment } = require("../controller/comment")
const tokenVerify = require("../middleware/tokenVerify")
const {commentParam,postParam} = require("../middleware/getParam")


router.get("/",getComment);


router.param("postId", postParam);
router.param("commentId",commentParam)
router.post("/:postId/add", addComment)
router.delete("/:postId/delete/:commentId",deleteComment);
router.post("/:commentId/like" , likeComment)
router.get("/:postId/all",getComment)


module.exports =  router