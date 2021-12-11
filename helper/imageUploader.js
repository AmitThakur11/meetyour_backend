const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloudname : "dexterology",
    api_key : "687311947292553",
    api_secret: "OaQY_L5k9JjkjbnFkLEnynyqOxg"
})


module.exports = cloudinary