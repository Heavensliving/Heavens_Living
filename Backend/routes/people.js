const express = require('express');

const router = express.Router();
const AddPeopleController = require('../controller/AddPeopleController');


router.post("/add",AddPeopleController.addPeople);

router.get("/get-people", AddPeopleController.getAllPeople);

router.put("/edit-person/:id",AddPeopleController.updatePerson);

router.delete("/delete-person/:id", AddPeopleController.deletePerson);

router.get("/get-people/:id",AddPeopleController.getPersonById)



module.exports =router;