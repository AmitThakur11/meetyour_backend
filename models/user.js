const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required :true
    },
    lastname :{
        type :String,
        requied : true
    },
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
        default :"https://car.png"
    },
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
    timeStamp : true
})

const User = mongoose.model('User',userSchema);


module.exports = User