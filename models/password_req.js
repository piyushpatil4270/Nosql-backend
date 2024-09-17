const { default: mongoose } = require("mongoose");

const Schema=mongoose.Schema

const objectId=mongoose.Schema.Types.ObjectId

const passwordReq=Schema({
userId:{
    type:objectId,
    required:true
},
isActive:{
    type:Boolean,
    default:true
}
})

const Request=mongoose.model("Password_requests",passwordReq)
module.exports=Request