const jwt =  require('jsonwebtoken');
const bcrypt = require('bcryptjs') ;
const  User = require("../models/user.js")
const  {setResponse} = require("../utils");

const register = async(req,res)=>{
    let {firstname , lastname , username , email , password , dateOfBirth } = req.body;
    try{
        let userByName = await User.find({username});
        let userByEmail = await User.find({email});
        if(userByName && userByEmail){
            setResponse(res,400,'User already exist')
        }

        password = bcrypt.genSalt(password,10);
        const newUser = await new User({firstname,lastname,username,email,password,dateOfBirth})
        await newUser.save();
        setResponse(res,200,"Registeration successful")

    }catch(err){
        setResponse(res,err.status,err.message)

    }
}

const login = async (req,res)=>{
    const {username , email , password} = req.body;
    try{
        if(username){
            let user = User.find({username});
        }
        if(email){
            let user = User.find({email});
        }
    
        if(!user){
            return setResponse(res,404,"User not found")
        }
    
        let hashedPassword = user.password ;
        password = await bcrypt.verify(password,hashedPassword);
        if(!password){
            return setResponse(res,400,"Incorrect password")
        }
    
        const token =  jwt.sign({_id : user._id},process.env.JWT_SECRET);
        const populateData  = user.populate('post');
        setResponse(res,200,"Login successful")
    }catch(err){
        setResponse(res,err.status,err.message)
    }

}

module.exports =  {register , login}