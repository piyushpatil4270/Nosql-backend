
const expenses=require("../models/expenses")
const User = require("../models/users")
const moment=require("moment")
const mongoose=require("mongoose")
const users=require("../models/users")


const addExpense=async(req,res,next)=>{
    try {
      const {title,category,description,amount,date}=req.body
      const userId=req.user._id
      const createdOn=moment(date).toDate()
      const userObjectId =new mongoose.Types.ObjectId(userId)
      const expense=await expenses.create({
        title:title,
        description:description,
        category:category,
        userId:userObjectId,
        amount:amount,
        createdOn:createdOn
      })
      await User.findByIdAndUpdate(userId,{$inc: { totalExpenses: amount}})
      res.status(202).json("Expense added successfully")
    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
}

const getAllExpenses=async(req,res,next)=>{
    try {
        const {date,skip,page,limit}=req.body
        const userId=req.user._id
        const startDate=moment.utc(date).startOf('day').toDate()
        const endDate=moment.utc(date).endOf("day").toDate()
        const userObjectId =new mongoose.Types.ObjectId(userId)
        const totalExpensesCount = await expenses.countDocuments({
          userId: userObjectId,
          createdOn: {
              $gte: startDate,
              $lte: endDate
          }
      });
      const offset=(page-1)*limit
        const userExpenses=await expenses.find({userId:userObjectId,createdOn: {
            $gte: startDate,  
            $lte: endDate     
          }}).limit(Number(limit))  
          .skip(Number(offset))   
          .sort({ createdOn: 1 });
          let total=0
          userExpenses.forEach((exp)=>{
            total+=exp.amount
          })
          res.status(202).json({expenses:userExpenses,total:total,totalEx:totalExpensesCount})


    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
}

const deleteExpense=async(req,res,next)=>{
    try {
      const {id}=req.params
      const userId=req.user._id
      const objectId=new mongoose.Types.ObjectId(userId)
   

      const user=await users.findById(objectId)
      const userObjectId =new mongoose.Types.ObjectId(id)
      const expense=await expenses.findById(userObjectId)
      const deletedExpense=await expenses.findByIdAndDelete(userObjectId)
      const updateExpenses=await users.findByIdAndUpdate(objectId,{totalExpenses:user.totalExpenses-expense.amount})
      res.status(202).json("Expense deleted")
  
    } catch (error) {
      console.log(error)
      res.status(404).json("An error occured try again")
    }
  }


  const getMonthlyExpenses=async(req,res,next)=>{
    try {
        const {date,skip,page,limit}=req.body
        const userId=req.user._id
        const startDate=moment.utc(date).startOf('month').toDate()
        const endDate=moment.utc(date).endOf('month').toDate()
        const userObjectId =new mongoose.Types.ObjectId(userId)
        const totalCnt=await expenses.countDocuments({userId:userObjectId,createdOn: {
          $gte: startDate,  
          $lte: endDate     
        }})
        const offset=(page-1)*limit
        const userExpenses=await expenses.find({userId:userObjectId,createdOn: {
            $gte: startDate,  
            $lte: endDate     
          }})
          .limit(Number(limit))  
          .skip(Number(offset))   
          .sort({ createdOn: 1 });
          res.status(202).json({expenses:userExpenses,total:totalCnt})

    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
}

const getYearlyExpenses=async(req,res,next)=>{
    try {
        const {date,skip,page,limit}=req.body
        const userId=req.user._id
        const userObjectId =new mongoose.Types.ObjectId(userId)
        console.log(userObjectId)
        const startYear=moment.utc(date).startOf("year").toDate()
        const endYear=moment.utc(date).endOf("year").toDate()
      
        const allExpenses=await  expenses.aggregate([
          {
            $match: {
                userId:userObjectId,
              createdOn: {
                $gte: startYear,  
                $lte: endYear
              }
            }
          },
          {
          $group: {
              _id: { 
                month: { $month: "$createdOn" }  
              },
              totalAmount: { $sum: "$amount" }  
            }
          },
          {
            $sort: { "_id.month": 1 }  
          }
        ])
        let expArray=[{month:1,expenses:0},{month:2,expenses:0},{month:3,expenses:0},{month:4,expenses:0},{month:5,expenses:0},{month:6,expenses:0},{month:7,expenses:0},{month:8,expenses:0},{month:9,expenses:0},{month:10,expenses:0},{month:11,expenses:0},{month:12,expenses:0}]
         allExpenses.map((item)=>{
            const month=item._id.month
            const idx=expArray.findIndex((ele)=>ele.month===month)
            if(idx>=0)expArray[idx].expenses+=item.totalAmount
         })
        res.status(202).json(expArray)
    } catch (error) {
        console.log(error)
        res.status(202).json("An error occured try again")
    }
}

const getExpensesByCategory=async(req,res,next)=>{
    try {
        const {date}=req.body
        const userId=req.user._id
        const startYear=moment.utc(date).startOf("year").toDate();
        const endYear=moment.utc(date).endOf("year").toDate()
        const userObjectId=new mongoose.Types.ObjectId(userId)
        const allExpenses = await expenses.aggregate([
            {
              $match: {
                userId: userObjectId,  
                createdOn: {
                  $gte: startYear,    
                  $lte: endYear        
                }
              }
            },
            {
              $group: {
                _id: { category: "$category" },  
                totalAmount: { $sum: "$amount" } 
              }
            },
            {
              $sort: { totalAmount: -1 }  
            }
          ]);
          res.status(202).json(allExpenses)
    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
}

const getLeaderboard=async(req,res,next)=>{
    try {
      const topUsers = await users.find()  
      .sort({ totalExpenses: -1 })     
      .limit(5)                     
      .exec(); 
      
      res.status(202).json(topUsers)    
    } catch (error) {
      console.log(error)
      res.status(404).json("An error occured try again")
    }
  }


  module.exports={getLeaderboard,getExpensesByCategory,getAllExpenses,getMonthlyExpenses,getYearlyExpenses,deleteExpense,addExpense}