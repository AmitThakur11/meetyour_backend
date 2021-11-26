const express = require('express')
const {register , login} = require("../controller/auth")
const route = express.Router();

route.post("/register",register);
route.post("/login",login)


module.exports = route