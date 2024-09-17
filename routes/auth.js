const express=require("express")
const router=express.Router()
const { signUp, signIn, forgotPassword, resetPassword } = require("../controllers/auth")


router.post("/signup",signUp)

router.post("/signin",signIn)

router.post("/forgotPassword",forgotPassword)

router.post("/reset/:id",resetPassword)

module.exports=router