
const expenses=require("../models/expenses")
const User = require("../models/users")
const moment=require("moment")
const mongoose=require("mongoose")
const users=require("../models/users")
const { handleAddExpense, handleGetAllExpenses, handleDeleteExpenses, handleLeaderboard, handleGetMonthlyExpenses, handleExpensesByCategory, handleYearlyExpenses } = require("../services/expenses")


const addExpense=async(req,res,next)=>{
    try {
      const userId=req.user._id
      await handleAddExpense(req.body,userId)
      res.status(202).json("Expense added successfully")
    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
}

const getAllExpenses=async(req,res,next)=>{
    try {
      
        const userId=req.user._id
      const result= await handleGetAllExpenses(userId,req.body)
res.status(202).json(result)

    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
}

const deleteExpense=async(req,res,next)=>{
    try {
      const {id}=req.params
      const userId=req.user._id
     await handleDeleteExpenses(id,userId)
      res.status(202).json("Expense deleted")
  
    } catch (error) {
      console.log(error)
      res.status(404).json("An error occured try again")
    }
  }


  const getMonthlyExpenses=async(req,res,next)=>{
    try {
        
        const userId=req.user._id
         const result=await handleGetMonthlyExpenses(userId,req.body)
          res.status(202).json(result)

    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
}

const getYearlyExpenses=async(req,res,next)=>{
    try {
       
        const userId=req.user._id
        const res=await handleYearlyExpenses(userId,req.body)
      
        res.status(202).json(result)
    } catch (error) {
        console.log(error)
        res.status(202).json("An error occured try again")
    }
}

const getExpensesByCategory=async(req,res,next)=>{
    try {
      const userId=req.user._id
        const result=await handleExpensesByCategory(userId,req.body)
       res.status(202).json(result)
    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
}

const getLeaderboard=async(req,res,next)=>{
    try {
      const topUsers = await handleLeaderboard()
      res.status(202).json(topUsers)    
    } catch (error) {
      console.log(error)
      res.status(404).json("An error occured try again")
    }
  }


  module.exports={getLeaderboard,getExpensesByCategory,getAllExpenses,getMonthlyExpenses,getYearlyExpenses,deleteExpense,addExpense}