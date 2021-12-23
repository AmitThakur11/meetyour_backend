const  jwt = require('jsonwebtoken');

const tokenVerify = (req,res,next)=>{
    const token = req.headers.authorization;
   try{
    const userId =  jwt.verify(token,process.env.JWT_SECRET);
        req.user = userId;
        next();
    
   }catch(err){
       res.status(500).json({
           success : false,
           msg :"Session expired"

       })
   }

}

module.exports =  tokenVerify
