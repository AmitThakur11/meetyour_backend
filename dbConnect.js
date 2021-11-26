const mongoose = require('mongoose');

const dbConnect = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    console.log("database connected")
}catch(err){
    console.log(err)
}
}

module.exports = dbConnect