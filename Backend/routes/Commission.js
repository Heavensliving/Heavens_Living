const express = require('express');
const { 
  addCommission, 
  getCommissionsByPropertyId, 
  updateCommission, 
  deleteCommission, 
  getCommissionById 
} = require('../components/commissionController'); // Adjust the path accordingly

const router = express.Router();

// Route to add a commission
router.post('/add', addCommission);

// Route to get all commissions by property ID
router.get('/:propertyId', getCommissionsByPropertyId);

// Route to update a commission by ID
router.put('/update/:commissionId', updateCommission);

// Route to delete a commission by ID
router.delete('/delete/:commissionId', deleteCommission);

// Route to get a commission by ID
router.get('/:commissionId', getCommissionById);

router.get('/total/:propertyId', getCommissionsByPropertyId);

module.exports = router;
