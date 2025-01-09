const express = require('express');

const router = express.Router();
const AddPeopleController = require('../controller/AddPeopleController');
const { verifyToken } = require('../middleware/tokenVerify');


router.post("/add", verifyToken, AddPeopleController.addPeople);

router.get("/get-people", verifyToken, AddPeopleController.getAllPeople);

router.put("/edit-person/:id", verifyToken, AddPeopleController.updatePerson);

router.delete("/delete-person/:id", verifyToken, AddPeopleController.deletePerson);

router.get("/get-people/:id", verifyToken, AddPeopleController.getPersonById)

router.get('/:renterId',verifyToken, AddPeopleController.getPeopleRentByGeneratedId);



module.exports =router;