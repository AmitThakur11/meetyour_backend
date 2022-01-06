const jwt =  require('jsonwebtoken');
const bcrypt = require('bcryptjs') ;
const  User = require("../models/user.js")
const  {setResponse} = require("../utils");

const register = async(req,res)=>{
    let {username , email , password , dateOfBirth } = req.body;
    try{
        let userByName = await User.findOne({username  : username});
        
        let userByEmail = await User.findOne({email : email});
        
        if(userByName || userByEmail){
            setResponse(res,400,'User already exist')
        }

        password = bcrypt.hashSync(password,10);
        const newUser = await new User({username,email,password,dateOfBirth ,website : ""})
        await newUser.save();

        const token =  jwt.sign({_id : newUser._id},process.env.JWT_SECRET , {expiresIn : "7d" });
        const data  = await newUser.populate("post followers following savePost blockList");
        setResponse(res,200,"Registeration successful",{token , data})

    }catch(err){
        setResponse(res,500,err.message)

    }
}

const login = async (req,res)=>{
    let { email , password} = req.body;
    try{

        let user = await User.findOne({email : email});
    
        if(!user){
            return setResponse(res,404,"User not found")
        }
    
        let hashedPassword = user.password ;
        password = bcrypt.compareSync(password,hashedPassword);
        if(!password){
            return setResponse(res,400,"Incorrect password")
        }
    
        const token =  jwt.sign({_id : user._id},process.env.JWT_SECRET ,{expiresIn : "7d"});
        setResponse(res,200,"Login successful",{token : token , data : user})
    }catch(err){
        setResponse(res,500,err.message)
    }

}

module.exports =  {register , login}