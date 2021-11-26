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