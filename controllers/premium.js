const express=require("express")
const crypto=require("crypto")
const router=express.Router()
const auth=require("../middleware/auth")
const mongoose=require("mongoose")
const users=require("../models/users")
const { handlePremium } = require("../services/premium")

function generateHash(key, txnid, amount, productinfo, firstname, email, salt) {
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
  }
  
  
const addUser=async(req,res,next)=>{
    try {
        const userId=req.user._id
       
        const update=await handlePremium(userId)
        res.status(202).json("You are premium user now")
    } catch (error) {
        console.log(error)
        res.status(404).json("An error occured try again")
    }
}

const payAmount=async (req, res, next) => {
    try {
      const { txnid, amount, productinfo, firstname, email, phone } = req.body;
      const hash = generateHash(process.env.PAYU_KEY, txnid, amount, productinfo, firstname, email, process.env.PAYU_SALT);
      const payuData = {
        key: process.env.PAYU_KEY,
        txnid: txnid,
        amount: amount,
        productinfo: productinfo,
        firstname: firstname,
        email: email,
        phone: phone,
        surl: 'http://localhost:5500/success',
        furl: 'http://localhost:5500/failure',
        hash: hash,
        service_provider: 'payu_paisa',
      };
  
      res.status(200).json({ ...payuData, status: 'success' });
    } catch (error) {
      console.error('Error in /payu endpoint:', error);
      res.status(500).json({ status: 'failure', message: 'Internal Server Error' });
    }
  }


  const verifyTransaction=(req, res) => {
    try {
      const { key, txnid, amount, productinfo, firstname, email, status, hash } = req.body;
      const newHash = generateHash(key, txnid, amount, productinfo, firstname, email, process.env.PAYU_SALT);
      if (newHash === hash) {
        res.status(200).json({ status: 'success', message: 'Payment Successful' });
      } else {
        res.status(400).json({ status: 'failure', message: 'Payment Verification Failed' });
      }
    } catch (error) {
      console.error('Error in /payu_response endpoint:', error);
      res.status(500).json({ status: 'failure', message: 'Internal Server Error' });
    }
  }

  module.exports={verifyTransaction,payAmount,addUser}