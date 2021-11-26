const  jwt = require('jsonwebtoken');

const tokenVerify = (req,res,next)=>{
    const jwtKey = process.env.JWT_KEY;
    const token = req.headers.authorization;
   try{
    const userId =  jwt.verify(token,jwtKey);
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