const express = require('express');
const PhaseController = require('../controller/PhaseContoller');
const { verifyToken } = require('../middleware/tokenVerify');

const router = express.Router()

router.get('/', verifyToken, PhaseController.getAllPhases);

router.get('/:id', verifyToken, PhaseController.getPhaseById);

router.get('/phases/:id', verifyToken, PhaseController.getPhasesForBranch);

router.post('/add', verifyToken, PhaseController.addPhase);

router.put('/update/:id', verifyToken, PhaseController.updatePhase);

router.delete('/delete/:id', verifyToken, PhaseController.deletePhase);


module.exports = router;
