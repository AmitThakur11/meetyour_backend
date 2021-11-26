const {setResponse} = require("../utils")

const userParam = (req,res,next,id)=>{
    try{
        req.userId = id;
        next()
    }catch(err){
        setResponse(res,err.status,err.message)
    }
}


const postParam =(req,res , next,id)=>{
    try{
        req.postId = id
        next()
    }catch(err){
        setResponse(res,err.status,err.message)

    }
    
}

const commentParam =(req,res,next,id)=>{
    try{
    req.commentId = id
    next();
    }catch(err){
        setResponse(res,err.status,err.message)
    }
}

module.exports =  {userParam , postParam , commentParam}