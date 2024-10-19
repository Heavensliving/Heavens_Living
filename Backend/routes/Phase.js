const express = require('express');
const PhaseController = require('../controller/PhaseContoller');

const router = express.Router()

router.get('/',PhaseController.getAllPhases);

router.get('/:id',PhaseController.getPhaseById);

router.post('/add',PhaseController.addPhase);

router.put('/update/:id',PhaseController.updatePhase);

router.delete('/delete/:id',PhaseController.deletePhase);


module.exports = router;
