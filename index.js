const express=require("express")
const authRouter=require("./routes/auth")
const expenseRouter=require("./routes/expenses")
const resetRouter=require("./routes/resetPassword")
const premiumRouter=require("./routes/premium")
const bodyParser=require("body-parser")
const app=express()
const path=require("path")
const cors=require("cors")

const mongoConnect=require("./utils/database")

app.use(bodyParser.json())
app.use(express.json())
app.use(cors())
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));




 mongoConnect()



  
  
  app.get("/",(req,res,next)=>{
    res.json("We are live")
  })
  app.post('/success', (req, res) => {
    res.json('Payment Successful');
  });
  
  app.post('/failure', (req, res) => {
    res.json('Payment failed');s
  });

app.use("/auth",authRouter)
app.use("/expenses",expenseRouter)
app.use("/password",resetRouter)
app.use("/premium",premiumRouter)

module.exports = app;

