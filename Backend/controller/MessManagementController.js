const MessManagement = require('../Models/messManagement');

// Allowed meal types
const allowedMealTypes = ['breakfast', 'lunch', 'dinner'];

// Add food items to all meals for a day
const addFood = async (req, res) => {
  try {
    const { dayOfWeek, meals, } = req.body;

    // Validate that all meal types are provided and contain at least one item
    if (!meals || !allowedMealTypes.every(type => meals[type]?.length)) {
      return res.status(400).json({ message: 'All meal types (breakfast, lunch, dinner) must be provided and contain at least one item.' });
    }

    const messManagement = await MessManagement.findOne({ dayOfWeek });

    if (!messManagement) {
      // Create a new meal plan
      const newMessManagement = new MessManagement({ 
        dayOfWeek, 
        breakfast: [...new Set(meals.breakfast)],
        lunch: [...new Set(meals.lunch)],
        dinner: [...new Set(meals.dinner)]
      });
      await newMessManagement.save();
      res.status(201).json({ message: 'Food items added successfully' });
    } else {
      // Append new food items to existing meals, ensuring no duplicates
      messManagement.breakfast = [...new Set([...messManagement.breakfast, ...meals.breakfast])];
      messManagement.lunch = [...new Set([...messManagement.lunch, ...meals.lunch])];
      messManagement.dinner = [...new Set([...messManagement.dinner, ...meals.dinner])];
      await messManagement.save();
      res.status(200).json({ message: 'Food items updated successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding food items', error });
  }
};

const getAllMeals = async (req, res) => {
  try {
    const meals = await MessManagement.find();
    
    if (!meals.length) {
      return res.status(404).json({ message: 'No meals found.' });
    }

    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meals', error });
  }
};


// Get meal plan for a specific day of the week and property ID
const getMealPlan = async (req, res) => {
  try {
    const { dayOfWeek, propertyId } = req.params;
    const messManagement = await MessManagement.findOne({ dayOfWeek, propertyId });

    if (!messManagement) {
      res.status(404).json({ message: 'No meal plan found for this day and property' });
    } else {
      res.status(200).json(messManagement);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving meal plan', error });
  }
};

const deleteFoodItem = async (req, res) => {
  try {
    const { dayOfWeek, mealType, itemToDelete } = req.body; // Ensure 'itemToDelete' is used here

    // Validate input
    if (!dayOfWeek || !mealType || !itemToDelete) {
      return res.status(400).json({ message: 'dayOfWeek, mealType, and itemToDelete are required.' });
    }

    // Validate mealType
    if (!allowedMealTypes.includes(mealType)) {
      return res.status(400).json({ message: 'Invalid meal type. Allowed types are breakfast, lunch, dinner.' });
    }

    // Find the meal plan for the specified day
    const messManagement = await MessManagement.findOne({ dayOfWeek });

    if (!messManagement) {
      return res.status(404).json({ message: 'Meal plan not found for the specified day.' });
    }

    // Pull the item from the specified meal type array
    const updateResult = await MessManagement.findOneAndUpdate(
      { dayOfWeek },
      { $pull: { [mealType]: itemToDelete } },
      { new: true }  // Return the updated document
    );

    // Check if any item was deleted
    if (updateResult && updateResult[mealType].includes(itemToDelete)) {
      return res.status(404).json({ message: `Item "${itemToDelete}" not found in ${mealType}.` });
    }

    res.status(200).json({ message: `Item "${itemToDelete}" deleted from ${mealType}.` });
  } catch (error) {
    console.error(error); // Log the error for further investigation
    res.status(500).json({ message: 'Error deleting food item', error: error.message });
  }
};


// Update food items in meals for a specific day and property ID
const updateFood = async (req, res) => {
  try {
    const { dayOfWeek, meals } = req.body;

    // Validate that all meal types are provided and contain at least one item
    if (!meals || !allowedMealTypes.every(type => meals[type]?.length)) {
      return res.status(400).json({ message: 'All meal types (breakfast, lunch, dinner) must be provided and contain at least one item.' });
    }

    const messManagement = await MessManagement.findOne({ dayOfWeek });

    if (!messManagement) {
      res.status(404).json({ message: 'No meal plan found for this day and property' });
    } else {
      // Update food items while avoiding duplicates
      messManagement.breakfast = [...new Set([...messManagement.breakfast, ...meals.breakfast])];
      messManagement.lunch = [...new Set([...messManagement.lunch, ...meals.lunch])];
      messManagement.dinner = [...new Set([...messManagement.dinner, ...meals.dinner])];
      await messManagement.save();
      res.status(200).json({ message: 'Food items updated successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating food items', error });
  }
};

// Delete meal plan for a specific day and property ID
const deleteMealPlan = async (req, res) => {
  try {
    const { dayOfWeek } = req.params;
    const result = await MessManagement.findOneAndDelete({ dayOfWeek });

    if (!result) {
      res.status(404).json({ message: 'No meal plan found for this day and property' });
    } else {
      res.status(200).json({ message: 'Meal plan deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting meal plan', error });
  }
};

module.exports = {
  addFood,
  getAllMeals,
  getMealPlan,
  deleteFoodItem,
  updateFood,
  deleteMealPlan,
};
