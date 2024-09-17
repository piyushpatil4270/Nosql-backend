const { default: mongoose } = require("mongoose");

const Schema=mongoose.Schema
const objectId=mongoose.Schema.Types.ObjectId


const expenses=new Schema({
   title:{
    type:String,
    required:true
   },
   category:{
    type:String,
    required:true
   },
   description:{
    type:String,
    required:true
   },
   userId:{
    type:objectId,
    ref: "Users",
    required:true
   },
   amount:{
    type:Number,
    default:0
   },
   createdOn:{
    type:Date,
    default:Date.now
   }

})


const Expenses=mongoose.model("Expenses",expenses)

module.exports=Expenses