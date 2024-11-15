const express = require('express');
const { 
  addCommission, 
  getCommissionsByPropertyId, 
  updateCommission, 
  deleteCommission, 
  getCommissionById, 
  getAllCommissions,
  getTotalCommission
} = require('../controller/commissionController'); // Adjust the path accordingly
const { verifyToken } = require('../middleware/tokenVerify');

const router = express.Router();

// Route to add a commission
router.post('/add', verifyToken, addCommission);

// Route to get all commissions by property ID
router.get('/:propertyId', verifyToken, getCommissionsByPropertyId);

// Route to update a commission by ID
router.put('/update/:commissionId', verifyToken, updateCommission);

// Route to delete a commission by ID
router.delete('/delete/:commissionId', verifyToken, deleteCommission);

// Route to get a commission by ID
router.get('/:commissionId', verifyToken, getCommissionById);

router.get('/total/:propertyId', verifyToken, getCommissionsByPropertyId);

router.get('/', verifyToken, getAllCommissions);

router.get('/totalCommission', verifyToken, getTotalCommission)



module.exports = router;
