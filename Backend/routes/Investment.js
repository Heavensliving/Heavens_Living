const express = require("express");
const router = express.Router();
const InvestmentController = require("../controller/InvestmentController");
const {verifyToken} = require("../middleware/tokenVerify")


router.get("/",verifyToken, InvestmentController.getAllInvestments);

router.post("/add",verifyToken, InvestmentController.addInvestment);

router.put("/update/:id",verifyToken, InvestmentController.editInvestment);

router.delete("/delete/:id",verifyToken, InvestmentController.deleteInvestment);

router.get("/:id",verifyToken, InvestmentController.getInvestmentById);

module.exports = router;
