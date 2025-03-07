const express = require("express");
const { addAppUi, getAllAppUi, getAppUiById, editAppUi, deleteAppUi } = require("../controller/appUiController.js");

const router = express.Router();

router.post("/add", addAppUi); 

router.get("/", getAllAppUi); 

router.get("/:id", getAppUiById); 

router.put("/update/:id", editAppUi); 

router.delete("/delete/:id", deleteAppUi); 

module.exports = router;
