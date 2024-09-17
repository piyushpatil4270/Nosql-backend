const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  addUser,
  payAmount,
  verifyTransaction,
} = require("../controllers/premium");

router.post("/addUser", auth, addUser);

router.post("/payu", payAmount);

router.post("/payu_response", verifyTransaction);

module.exports = router;
