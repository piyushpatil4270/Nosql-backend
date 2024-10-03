
const expenses=require("../models/expenses")
const Users = require("../models/users")
const moment=require("moment")
const mongoose=require("mongoose")




exports.handleAddExpense=async(body,userId)=>{
    const {title,category,description,amount,date}=body
    const createdOn=moment(date).toDate()
    const userObjectId=new mongoose.Types.ObjectId(userId)
    const expense=await expenses.create({
        title:title,
        description:description,
        category:category,
        userId:userObjectId,
        amount:amount,
        createdOn:createdOn
    })
    await Users.findByIdAndUpdate(userId,{$inc: { totalExpenses: amount}})
     return 1
}


exports.handleGetAllExpenses=async(userId,body)=>{
    const {date,skip,page,limit}=body
    const startDate=moment.utc(date).startOf('day').toDate()
    const endDate=moment.utc(date).endOf("day").toDate()
    const userObjectId =new mongoose.Types.ObjectId(userId)
    const totalExpensesCount=await expenses.countDocuments({
        userId:userObjectId,
        createdOn: {
            $gte: startDate,
            $lte: endDate
        }
    })
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
      return {expenses:userExpenses,total:total,totalEx:totalExpensesCount}

}


exports.handleDeleteExpenses=async(id,userId)=>{
const objectId=new mongoose.Types.ObjectId(userId)
const user=await Users.findById(objectId)
const expenseObjectId=new mongoose.Types.ObjectId(id)
const expense=await expenses.findById(expenseObjectId)
const deleteExpense=await expenses.findByIdAndDelete(expenseObjectId)
const updateExpenses=await Users.findByIdAndUpdate(objectId,{  totalExpenses:user.totalExpenses-expense.amount})
return 1
}


exports.handleLeaderboard=async()=>{
   const topUsers=await Users.find()  
   .sort({ totalExpenses: -1 })     
   .limit(5)                     
   .exec(); 
   return topUsers
}


exports.handleGetMonthlyExpenses=async(userId,body)=>{
    try {
        const {date,skip,page,limit}=body
        const userObjectId=new mongoose.Types.ObjectId(userId)
        const startDate=moment.utc(date).startOf('month').toDate()
            const endDate=moment.utc(date).endOf('month').toDate()
            const totalCnt=await expenses.countDocuments({userId:userObjectId,createdOn:{
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
              return {expenses:userExpenses,total:totalCnt}
    } catch (error) {
        console.log(error)
    }
 
}


exports.handleExpensesByCategory=async(userId,body)=>{
const {date}=body
const userObjectId=new mongoose.Types.ObjectId(userId)
const startYear=moment.utc(date).startOf("year").toDate();
const endYear=moment.utc(date).endOf("year").toDate()
const allExpenses=await expenses.aggregate([
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
  ])
  return allExpenses
}


exports.handleYearlyExpenses=async(userId,body)=>{
    const {date,skip,page,limit}=body
    const userObjectId=new mongoose.Types.ObjectId(userId)
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
       return expArray
}


