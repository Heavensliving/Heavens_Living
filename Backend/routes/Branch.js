const express = require('express');
const BranchController = require('../controller/BranchController');
const { verifyToken } = require('../middleware/tokenVerify');

const router = express.Router()

router.get('/', verifyToken, BranchController.getAllBranches);

router.get('/:id', verifyToken, BranchController.getBranchById);

router.post('/add', verifyToken, BranchController.addBranch);

router.put('/update/:id', verifyToken, BranchController.updateBranch);

router.delete('/delete/:id', verifyToken, BranchController.deleteBranch);



module.exports = router;
