const express=require("express")
const crypto=require("crypto")
const router=express.Router()
const auth=require("../middleware/auth")
const mongoose=require("mongoose")
const users=require("../models/users")



exports.handlePremium=async(userId)=>{
const userObjectId=new mongoose.Types.ObjectId(userId)
const updateUser=await users.findOneAndUpdate({_id:userObjectId},{isPremium:true})
return 1
}