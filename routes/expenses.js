const express=require("express")
const router=express.Router()

const auth=require("../middleware/auth")
const { addExpense, getAllExpenses, deleteExpense, getMonthlyExpenses, getYearlyExpenses, getExpensesByCategory, getLeaderboard } = require("../controllers/expenses")

router.post("/add",auth,addExpense)


router.post("/getAllExpenses",auth,getAllExpenses)


router.post("/delete/:id",auth,deleteExpense)

router.post("/getMonthlyExpenses",auth,getMonthlyExpenses)


router.post("/getYearlyExpenses",auth,getYearlyExpenses)


router.post("/getExpensesByCategory",auth,getExpensesByCategory)



router.get("/getLeaderboard",auth,getLeaderboard)

module.exports=router