const router = require('express').Router();
const { getComment ,addComment , deleteComment } = require("../controller/comment")
const tokenVerify = require("../middleware/tokenVerify")
const {commentParam,postParam} = require("../middleware/getParam")

router.use(tokenVerify);
router.get("/",getComment);


router.param("postId", postParam);
router.param("commentId",commentParam)
router.post("/:postId/addComment", addComment)
router.delete("/:postId/delete/:commentId")


module.exports =  router