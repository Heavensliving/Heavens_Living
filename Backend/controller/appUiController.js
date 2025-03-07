const AppUi = require("../Models/appUiModel.js");

// Add App UI settings
exports.addAppUi = async (req, res) => {
    try {
        const newAppUi = new AppUi(req.body);
        const savedAppUi = await newAppUi.save();
        res.status(201).json({ message: "App UI settings added successfully", data: savedAppUi });
    } catch (error) {
        res.status(500).json({ message: "Error adding App UI settings", error: error.message });
    }
};

// Get all App UI settings
exports.getAllAppUi = async (req, res) => {
    try {
        const appUiList = await AppUi.find();
        res.status(200).json({ data: appUiList });
    } catch (error) {
        res.status(500).json({ message: "Error fetching App UI settings", error: error.message });
    }
};

// Get App UI settings by ID
exports.getAppUiById = async (req, res) => {
    try {
        const { id } = req.params;
        const appUi = await AppUi.findById(id);
        if (!appUi) {
            return res.status(404).json({ message: "App UI settings not found" });
        }
        res.status(200).json({ data: appUi });
    } catch (error) {
        res.status(500).json({ message: "Error fetching App UI settings", error: error.message });
    }
};

// Edit App UI settings by ID
exports.editAppUi = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAppUi = await AppUi.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedAppUi) {
            return res.status(404).json({ message: "App UI settings not found" });
        }
        res.status(200).json({ message: "App UI settings updated successfully", data: updatedAppUi });
    } catch (error) {
        res.status(500).json({ message: "Error updating App UI settings", error: error.message });
    }
};

// Delete App UI settings by ID
exports.deleteAppUi = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAppUi = await AppUi.findByIdAndDelete(id);
        if (!deletedAppUi) {
            return res.status(404).json({ message: "App UI settings not found" });
        }
        res.status(200).json({ message: "App UI settings deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting App UI settings", error: error.message });
    }
};
