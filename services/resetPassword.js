const express=require("express")
const resetReq=require("../models/password_req")
const mongoose=require("mongoose")


exports.handleResetRequest=async(reqId)=>{
const objectId=new mongoose.Types.ObjectId(id)
const passwordReq=await resetReq.findById(reqId)
if(passwordReq && passwordReq.isActive){
    return  1
}
else return 2
}