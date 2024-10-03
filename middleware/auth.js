const Users=require("../models/users")
const jwt=require("jsonwebtoken")
require("dotenv").config()



const authenticate=async(req,res,next)=>{
    try {
        const token=req.header("Authorization")
        console.log("Token is ",token)
        const user=jwt.verify(token,process.env.JWT_SECRETKEY)
        console.log(user)
        Users.findById(user.userId)
        .then((user)=>{
            console.log("User is ",JSON.stringify(user))
            req.user=user
            next()
        })
        .catch((err)=>{throw new Error(err)})
     
    } catch (error) {
        console.log(error)
        return res.status(404).json({success:false})
    }
}

module.exports=authenticate