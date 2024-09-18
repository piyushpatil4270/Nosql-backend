require("dotenv").config()
const mongoDb=require("mongodb")
const mongoose = require("mongoose")
const MongoClient=mongoDb.MongoClient






const mongoConnect=async()=>{
  try {
    await mongoose.connect(process.env.DB_STRING, {
     
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); 
  }
}
module.exports=mongoConnect