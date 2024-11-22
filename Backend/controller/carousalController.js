const Carousal = require('../Models/carousalModel')

// Add a new carousal
const addCarousal = async (req, res) => {
  try {
    const { cafeImages, homeScreenImages } = req.body;

    // Validate input
    if (!cafeImages || !homeScreenImages || !Array.isArray(cafeImages) || !Array.isArray(homeScreenImages)) {
      return res.status(400).json({ message: "All fields are required and should be arrays" });
    }

    const carousal = new Carousal({ cafeImages, homeScreenImages });
    await carousal.save();

    return res.status(201).json({ message: "Carousal added successfully", carousal });
  } catch (error) {
    console.error("Error adding carousal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update an existing carousal
const updateCarousal = async (req, res) => {
  try {
    const { id } = req.params;
    const { cafeImages, homeScreenImages } = req.body;

    // Validate input
    if (!cafeImages || !homeScreenImages || !Array.isArray(cafeImages) || !Array.isArray(homeScreenImages)) {
      return res.status(400).json({ message: "All fields are required and should be arrays" });
    }

    const updatedCarousal = await Carousal.findByIdAndUpdate(
      id,
      { cafeImages, homeScreenImages },
      { new: true }
    );

    if (!updatedCarousal) {
      return res.status(404).json({ message: "Carousal not found" });
    }

    return res.status(200).json({ message: "Carousal updated successfully", updatedCarousal });
  } catch (error) {
    console.error("Error updating carousal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a carousal
const deleteCarousal = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCarousal = await Carousal.findByIdAndDelete(id);
    if (!deletedCarousal) {
      return res.status(404).json({ message: "Carousal not found" });
    }

    return res.status(200).json({ message: "Carousal deleted successfully" });
  } catch (error) {
    console.error("Error deleting carousal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all carousals
const getAllCarousals = async (req, res) => {
  try {
    const carousals = await Carousal.find();
    return res.status(200).json(carousals);
  } catch (error) {
    console.error("Error fetching carousals:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a carousal by ID
const getCarousalById = async (req, res) => {
  try {
    const { id } = req.params;

    const carousal = await Carousal.findById(id);
    if (!carousal) {
      return res.status(404).json({ message: "Carousal not found" });
    }

    return res.status(200).json(carousal);
  } catch (error) {
    console.error("Error fetching carousal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addCarousal, updateCarousal, deleteCarousal, getAllCarousals, getCarousalById };
