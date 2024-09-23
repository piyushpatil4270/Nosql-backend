const { handleSignup, handleSignin, handleForgotPassword, resetUserPassword } = require("../services/auth")




const signUp=async(req,res,next)=>{
    try {
        const result=await handleSignup(req.body)
        if(result===1) return res.status(202).json("User with email already exist")
        res.status(201).json("User registered successfully")
        
    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
    }


const signIn=async(req,res,next)=>{
    try {
        const result=await handleSignin(req.body)
        if(result===1) return res.status(401).json("User with email does not exist")
        else if(result===2) return res.status(402).json("Enter correct password")
        res.status(202).json({ msg: "Login Successful", token: result });
    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
}

const forgotPassword=async(req,res,next)=>{
    try {
        const result=await handleForgotPassword(req.body)
        if(result===1) return res.status(401).json("User with email doesnt exist")
        else if(result===2) return res.status(402).json("Mail not sent try again")
        else res.status(202).json("Recovery mail sent to email address")      

    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
}

const resetPassword=async(req,res,next)=>{
    try {
      const {id}=req.params
  
      const result=await resetUserPassword(req.body,id)
       if(result===1) return res.status(404).json("User with email doesnt exist")
        res.status(202).json("Password reset successful")
    } catch (error) {
      console.log(error)
      res.status(404).json("An error occured try again")
    }
  }


module.exports={signUp,signIn,forgotPassword,resetPassword}