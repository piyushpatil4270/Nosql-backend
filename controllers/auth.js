const express=require("express")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const Users=require("../models/users")
const {v4:uuidv4} =require("uuid")
const resetReq=require("../models/password_req")
const mongoose=require("mongoose")
const nodemailer=require("nodemailer")
function generateToken(id) {
    const token = jwt.sign({ userId: id }, "fskhkahkk88245fafjklakljfalk");
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



const signUp=async(req,res,next)=>{
    try {
        const body = req.body;
        const username = body.username;
        const email = body.email;
        const user = await Users.findOne({username: username });
        if (user) return res.status(202).json("User already exist");
        const useremail = await Users.findOne({ email: email });
        if (useremail) return res.status(202).json("User with email already exist");
        const hasdhedPass = await bcrypt.hash(body.password, saltRounds);
        await Users.create({
          username: body.username,
          email: body.email,
          password: hasdhedPass,
        });
    
        res.json("User created succesfully");
        
    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
    }


const signIn=async(req,res,next)=>{
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email: email });
        if (!user) {
          return res.status(401).json("Email doesnt exist");
        }
    
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) return res.status(404).json("Password is incorrect");
        const token = generateToken(user.id);
        res.status(202).json({ msg: "Login Successful", token: token });
    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
}

const forgotPassword=async(req,res,next)=>{
    try {
        const {email}=req.body
        const user=await Users.findOne({email:email})
        if(!user) res.status(404).json("Enter valid email")
        const userId=user._id
        const uId=uuidv4()
        const reset_req=await resetReq.create({
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
                  <a href="http://localhost:5500/password/reset_password/${String(reset_req._id)}">Reset Password</a>
                </body>
              </html>`
           }
           transporter.sendMail(mailOptions,(err,info)=>{
            if(err){
              console.log(err)
              return res.status(404).json("Mail not sent try again")
            }
            console.log(info)
            res.status(202).json(`Mail sent to ${email} successfully`)
          })
         

    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
}

const resetPassword=async(req,res,next)=>{
    try {
      const {id}=req.params
  
      const {email,password}=req.body
      const user=await Users.findOne({email:email})
      if(!user) return res.send("User with email doesnt exist")
        const reqObjectId =new mongoose.Types.ObjectId(id)
       const hasdhedPass = await bcrypt.hash(password, saltRounds);
      const updatecnt=await Users.findOneAndUpdate({email:email},{password:hasdhedPass})
      const updateReq=await resetReq.findOneAndUpdate({_id:reqObjectId},{isActive:false})
      res.status(202).send("Password updated")
    } catch (error) {
      console.log(error)
      res.status(404).json("An error occured try again")
    }
  }


module.exports={signUp,signIn,forgotPassword,resetPassword}