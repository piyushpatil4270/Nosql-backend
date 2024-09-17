const express=require("express")
const resetReq=require("../models/password_req")
const mongoose=require("mongoose")


const handleRequest=async(req,res,next)=>{
    try {
        const {id}=req.params
       
        const reqId=new mongoose.Types.ObjectId(id)
        const passwordReq=await resetReq.findById(reqId)
        if(passwordReq && passwordReq.isActive){
            return  res.render("email",{id})
        }
        else res.send("Request timed-out")
    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
}

module.exports={handleRequest}