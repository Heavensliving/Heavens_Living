const express = require('express');
const BranchController = require('../controller/BranchController')

const router = express.Router()

router.get('/',BranchController.getAllBranches);

router.get('/:id',BranchController.getBranchById);

router.post('/add',BranchController.addBranch);

router.put('/update/:id',BranchController.updateBranch);

router.delete('/delete/:id',BranchController.deleteBranch);



module.exports = router;
