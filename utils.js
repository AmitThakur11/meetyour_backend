require('dotenv').config()
const cloudinary = require('cloudinary').v2

const setResponse = (res,status,msg,data)=>{
    switch(status){
        case 200:
            return res.status(status).json({
                success : true,
                msg,
                data
            })
        default :
            return res.status(status).json({
                success :false,
                msg
            })
    }}



cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME ,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET

})


 module.exports = {setResponse , cloudinary}
