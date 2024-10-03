const nodemailer=require("nodemailer")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const Users=require("../models/users")
const {v4:uuidv4} =require("uuid")
const passwordRequest=require("../models/password_req")
const { default: mongoose } = require("mongoose")
require("dotenv").config()
function generateToken(id) {
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRETKEY);
    return token;
  }
const saltRounds=10

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: 'piyushpatil4270@gmail.com',
        pass: 'uwzocqrsvibhjans' 
    }
})


exports.handleSignup=async(body)=>{
    const username = body.username;
    const email = body.email;
   
    const useremail = await Users.findOne({ email: email });
        if (useremail) return 1;
        const hasdhedPass = await bcrypt.hash(body.password, saltRounds);
        await Users.create({
          username: body.username,
          email: body.email,
          password: hasdhedPass,
        });
    
    return "User registered successfully"
}


exports.handleSignin=async(body)=>{
    const {email,password}=body
    const exUser=await Users.findOne({email:email})
    if(!exUser) return 1;
    const matched=await bcrypt.compare(password,exUser.password)
    if(!matched) return 2
    const token=generateToken(exUser.id)
    return token
}


exports.handleForgotPassword=async(body)=>{
const {email}=body
const exUser=await Users.findOne({email:email})
if(!exUser) return 1
const userId=exUser._id
const uId=uuidv4()
const resetReq=await passwordRequest.create({
    userId:userId
})
const mailOptions={
    from:'piyushpatil4270@gmail.com',
    to:email,
    subject:"Reset password",
    text:"Reset password for your expense tracker account",
    html:`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
        </head>
        <body>
          <a href="http://localhost:5500/password/reset_password/${String(resetReq._id)}">Reset Password</a>
        </body>
      </html>`
   }

   transporter.sendMail(mailOptions,(err,info)=>{
    if(err){
        console.log(err)
        return 2
    }
    return 3
   })

}


exports.resetUserPassword=async(body,id)=>{
  const {email,password}=req.body
  const exUser=await Users.findOne({email:email})
  if(!exUser) return 1
  const reqObjectId=new mongoose.Types.ObjectId(id)
  const hasdhedPass=await bcrypt.hash(password,saltRounds)
  const updatePassword=await Users.findOneAndUpdate({email:email},{password:hasdhedPass})
  const updateRequest=await passwordRequest.findOneAndUpdate({_id:reqObjectId},{isActive:false})
  return 2
}