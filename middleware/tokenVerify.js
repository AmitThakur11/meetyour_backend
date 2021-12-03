const  jwt = require('jsonwebtoken');

const tokenVerify = (req,res,next)=>{
    const token = req.headers.authorization;
   try{
    const userId =  jwt.verify(token,process.env.JWT_SECRET);
    if(userId){
        req.user = userId;
        next();
    }
   }catch(err){
       res.json({
           success : false,
           message :err.message

       })
   }

}

module.exports =  tokenVerify