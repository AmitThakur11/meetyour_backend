const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required:true,
        unique :true
    },
    email : {
        type :String,
        require:true,
        unique :true

    },
    password : {
        type :String,
        require:true,
        min : 6

    },
    dateOfBirth : {
        type : Date,
        require :true
    },
    displayPic : {
        type :String,
        default :"https://i.pinimg.com/474x/65/25/a0/6525a08f1df98a2e3a545fe2ace4be47.jpg"
    },
    bio : {
        type : String,
        default :""
    
    },
    website : {
        type : String,
        default :""
    
    }
        ,
    post :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post'
    }],
    followers : [{
        type :mongoose.Schema.Types.ObjectId,
        ref : 'User'

    }],
    following : [{
        type :mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    savePost :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post'
    }],
    blockList: [{
        type :mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }]

    

},{
    timestamps : true
})

const User = mongoose.model('User',userSchema);


module.exports = User