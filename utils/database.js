const mongoDb=require("mongodb")
const mongoose = require("mongoose")
const MongoClient=mongoDb.MongoClient






const mongoConnect=async()=>{
  try {
    await mongoose.connect('mongodb+srv://piyushpatil4270:xUMqpqXtNWCcezoU@cluster0.6t5ru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
     
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); 
  }
}
module.exports=mongoConnect