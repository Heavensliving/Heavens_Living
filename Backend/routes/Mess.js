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
const { verifyToken } = require('../middleware/tokenVerify');

// Add food item to a meal
router.post('/addFood', verifyToken, addFood);

router.get('/getAllMeals', verifyToken, getAllMeals)

router.put('/deleteFoodItem', verifyToken, deleteFoodItem)

// Get meal plan for a specific day of the week and property ID
router.get('/getMealPlan/:dayOfWeek/:propertyId', verifyToken, getMealPlan);

// Update food item in a meal for a specific day of the week and property ID
router.put('/updateFood/:dayOfWeek/:mealType/:foodItem/:propertyId', verifyToken, updateFood);

// Delete meal plan for a specific day of the week and property ID
router.delete('/deleteMealPlan/:dayOfWeek/', verifyToken, deleteMealPlan);

module.exports = router;
