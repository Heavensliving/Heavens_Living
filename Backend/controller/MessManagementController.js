const MessManagement = require('../Models/messManagement');

// Allowed meal types
const allowedMealTypes = ['breakfast', 'lunch', 'dinner'];

// Add food items to all meals for a day
const addFood = async (req, res) => {
  try {
    const { dayOfWeek, meals, propertyId, propertyName, studentName } = req.body;

    // Validate that all meal types are provided and contain at least one item
    if (!meals || !allowedMealTypes.every(type => meals[type]?.length)) {
      return res.status(400).json({ message: 'All meal types (breakfast, lunch, dinner) must be provided and contain at least one item.' });
    }

    const messManagement = await MessManagement.findOne({ dayOfWeek, propertyId });

    if (!messManagement) {
      // Create a new meal plan
      const newMessManagement = new MessManagement({ 
        dayOfWeek, 
        propertyId, 
        propertyName, 
        studentName,
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

// Update food items in meals for a specific day and property ID
const updateFood = async (req, res) => {
  try {
    const { dayOfWeek, propertyId, meals } = req.body;

    // Validate that all meal types are provided and contain at least one item
    if (!meals || !allowedMealTypes.every(type => meals[type]?.length)) {
      return res.status(400).json({ message: 'All meal types (breakfast, lunch, dinner) must be provided and contain at least one item.' });
    }

    const messManagement = await MessManagement.findOne({ dayOfWeek, propertyId });

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
    const { dayOfWeek, propertyId } = req.params;
    const result = await MessManagement.findOneAndDelete({ dayOfWeek, propertyId });

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
  getMealPlan,
  updateFood,
  deleteMealPlan,
};
