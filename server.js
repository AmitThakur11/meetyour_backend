const express = require('express');
const dotenv =  require('dotenv');
const cors = require('cors')
const  authRoute = require("./routes/auth");
const userRoute = require('./routes/user');
const commentRoute = require("./routes/comment")
const postRoute = require("./routes/post")
const dbConnect = require("./dbConnect")
const app = express();
app.use(cors());
app.use(express.json({limit: '25mb'}))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
dotenv.config()
const port = process.env.PORT

dbConnect();
app.get("/",(req,res)=>{
    res.send("working")
})

app.use("/auth",authRoute);
app.use("/post",postRoute);
app.use("/user",userRoute);
app.use("/comment",commentRoute);

app.listen(port,console.log(`server running at ${port}`))