// routes/messManagementRoutes.js

const express = require('express');
const router = express.Router();
const {
  addFood,
  getMealPlan,
  updateFood,
  deleteMealPlan,
} = require('../components/MessManagementController');

// Add food item to a meal
router.post('/addFood', addFood);

// Get meal plan for a specific day of the week and property ID
router.get('/getMealPlan/:dayOfWeek/:propertyId', getMealPlan);

// Update food item in a meal for a specific day of the week and property ID
router.put('/updateFood/:dayOfWeek/:mealType/:foodItem/:propertyId', updateFood);

// Delete meal plan for a specific day of the week and property ID
router.delete('/deleteMealPlan/:dayOfWeek/:propertyId', deleteMealPlan);

module.exports = router;
