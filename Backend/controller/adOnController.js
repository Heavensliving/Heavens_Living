// controllers/adOnController.js

const adOnSchema = require('../Models/adOnmodel'); // Ensure the correct path to your model

// Add a new add-on
const addAdOn = async (req, res) => {
  try {
    const { Itemname, prize, Quantity, propertyid, propertyname, image } = req.body;

    const newAdOn = new adOnSchema({
      Itemname,
      prize,
      Quantity,
      propertyid,
      propertyname,
      image,
    });

    await newAdOn.save();
    res.status(201).send({ message: 'Add-on added successfully', newAdOn });
  } catch (error) {
    res.status(500).send({ message: 'Error adding add-on', error });
  }
};

// Edit an existing add-on
const editAdOn = async (req, res) => {
  try {
    const { id } = req.params; // Get the id from params
    const updates = req.body; // Get updates from the request body

    const updatedAdOn = await adOnSchema.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedAdOn) {
      return res.status(404).send({ message: 'Add-on not found' });
    }

    res.status(200).send({ message: 'Add-on updated successfully', updatedAdOn });
  } catch (error) {
    res.status(500).send({ message: 'Error updating add-on', error });
  }
};

const updateAdOnStatus = async (req, res) => {
  try {
    const { id } = req.params; // Get the id from params
    const { status } = req.body; // Get the status from the request body

    // Validate the status
    if (!['available', 'unavailable'].includes(status)) {
      return res.status(400).send({ message: 'Invalid status value' });
    }

    const updatedAdOn = await adOnSchema.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedAdOn) {
      return res.status(404).send({ message: 'Add-on not found' });
    }

    res.status(200).send({ message: 'Add-on status updated successfully', updatedAdOn });
  } catch (error) {
    res.status(500).send({ message: 'Error updating add-on status', error });
  }
};

// Delete an add-on
const deleteAdOn = async (req, res) => {
  try {
    const { id } = req.params; // Get the id from params
    const deletedAdOn = await adOnSchema.findByIdAndDelete(id);

    if (!deletedAdOn) {
      return res.status(404).send({ message: 'Add-on not found' });
    }

    res.status(200).send({ message: 'Add-on deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting add-on', error });
  }
};

// Show all add-ons
const showAdOns = async (req, res) => {
  try {
    const adOns = await adOnSchema.find(); // Fetch all add-ons

    res.status(200).send(adOns);
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving add-ons', error });
  }
};

module.exports = {
  addAdOn,
  editAdOn,
  deleteAdOn,
  showAdOns,
  updateAdOnStatus,
};
