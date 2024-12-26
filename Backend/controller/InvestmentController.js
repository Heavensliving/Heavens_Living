const Investment = require("../Models/InvestmentModal");
const Property = require("../Models/Add_property")

// Controller to manage investments
const InvestmentController = {
  // Add a new investment
  addInvestment: async (req, res) => {
    try {
      const { name, propertyName, type, amount } = req.body;
  
      // Validate input fields
      if (!name || !propertyName || !type || !amount) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      if (amount <= 0) {
        return res.status(400).json({ message: "Investment amount must be greater than zero" });
      }
  
      // Fetch property and propertyId from the Property model
      const propertyData = await Property.findOne({ propertyName }).select("propertyId propertyName");
  
      if (!propertyData) {
        return res.status(404).json({ message: "Property not found" });
      }
  
      // Create a new investment document
      const newInvestment = new Investment({
        name,
        propertyId: propertyData.propertyId, // Store propertyId, not propertyName
        propertyName: propertyData.propertyName, // Optionally store the name as well
        type,
        amount,
      });
  
      // Save to the database
      const savedInvestment = await newInvestment.save();
      res.status(201).json({
        statusCode: 201,
        message: "Investment added successfully",
        data: savedInvestment,
      });
    } catch (error) {
      console.error("Error adding investment:", error);
      res.status(500).json({
        message: "Failed to add investment",
        error: error.message,
      });
    }
  },
  

  // Edit an investment by ID
  editInvestment: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      // Find investment by ID and update
      const updatedInvestment = await Investment.findByIdAndUpdate(
        id,
        updatedData,
        { new: true } // Return the updated document
      );

      if (!updatedInvestment) {
        return res.status(404).json({ message: "Investment not found" });
      }

      res.status(200).json({ message: "Investment updated successfully", data: updatedInvestment });
    } catch (error) {
      res.status(500).json({ message: "Failed to update investment", error: error.message });
    }
  },

  // Delete an investment by ID
  deleteInvestment: async (req, res) => {
    try {
      const { id } = req.params;

      // Find investment by ID and delete
      const deletedInvestment = await Investment.findByIdAndDelete(id);

      if (!deletedInvestment) {
        return res.status(404).json({ message: "Investment not found" });
      }

      res.status(200).json({ message: "Investment deleted successfully", data: deletedInvestment });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete investment", error: error.message });
    }
  },

  // Get all investments
  getAllInvestments: async (req, res) => {
    try {
      // Fetch all investments
      const investments = await Investment.find();
      res.status(200).json({ message: "Investments retrieved successfully", data: investments });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve investments", error: error.message });
    }
  },

  // Get a single investment by ID
  getInvestmentById: async (req, res) => {
    try {
      const { id } = req.params;

      // Find investment by ID
      const investment = await Investment.findById(id);

      if (!investment) {
        return res.status(404).json({ message: "Investment not found" });
      }

      res.status(200).json({ message: "Investment retrieved successfully", data: investment });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve investment", error: error.message });
    }
  },
};

module.exports = InvestmentController;
