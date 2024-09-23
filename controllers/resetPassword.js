const express=require("express")
const resetReq=require("../models/password_req")
const mongoose=require("mongoose")
const { handleResetRequest } = require("../services/resetPassword")


const handleRequest=async(req,res,next)=>{
    try {
        const {id}=req.params
       
        const result=await handleResetRequest(id)
        if(result===1){
            return  res.render("email",{id})
        }
        else res.send("Request timed-out")
    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
}

module.exports={handleRequest}