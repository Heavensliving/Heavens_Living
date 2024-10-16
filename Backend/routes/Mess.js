// routes/messManagementRoutes.js

const express = require('express');
const router = express.Router();
const {
  addFood,
  getMealPlan,
  updateFood,
  deleteMealPlan,
  getAllMeals,
  deleteFoodItem,
} = require('../controller/MessManagementController');

// Add food item to a meal
router.post('/addFood', addFood);

router.get('/getAllMeals', getAllMeals)

router.put('/deleteFoodItem', deleteFoodItem)

// Get meal plan for a specific day of the week and property ID
router.get('/getMealPlan/:dayOfWeek/:propertyId', getMealPlan);

// Update food item in a meal for a specific day of the week and property ID
router.put('/updateFood/:dayOfWeek/:mealType/:foodItem/:propertyId', updateFood);

// Delete meal plan for a specific day of the week and property ID
router.delete('/deleteMealPlan/:dayOfWeek/', deleteMealPlan);

module.exports = router;
