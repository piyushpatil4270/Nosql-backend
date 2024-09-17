const express=require("express")
const router=express.Router()
const resetReq=require("../models/password_req")
const mongoose=require("mongoose")
const { handleRequest } = require("../controllers/resetPassword")

console.log("This is reset password router...")
router.get("/:id",handleRequest)


module.exports=router