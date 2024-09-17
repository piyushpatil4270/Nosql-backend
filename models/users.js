const { default: mongoose } = require("mongoose");

const Schema=mongoose.Schema


const user=new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    totalExpenses:{
        type:Number,
        default:0
    },
    isPremium:{
        type:Boolean,
        default:false
    }
})


const User=mongoose.model("Users",user)

module.exports=User