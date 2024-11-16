const bcrypt = require('bcrypt'); 
const peopleModel = require('../Models/AddPeople'); 
const moment = require('moment');
const mongoose = require('mongoose');
const Property = require('../Models/Add_property');

// Add a new person
const addPeople = async (req, res) => {
  console.log("req.body", req.body)
  try {
  
    const { password } = req.body; 
    console.log("password",password)
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newPerson = new peopleModel({ ...req.body, password: hashedPassword }); 
    const propertyId = newPerson.propertyId
    console.log("newPerson",newPerson);

    await newPerson.save();
    const property = await Property.findOne({propertyId:propertyId});
    console.log("property",property._id);
    console.log("new person", newPerson._id)
    await Property.findByIdAndUpdate(property._id, { $push: { messPeople: newPerson._id } });
    res.status(201).json({ message: 'Person added successfully', data: newPerson });
  } catch (error) {
    res.status(500).json({ message: 'Error adding person', error: error.message });
  }
};
// Get all people
const getAllPeople = async (req, res) => {
  try {
    const people = await peopleModel.find();

    console.log('People fetched from the database:', people); // Log the fetched people

    const updatedPeople = people.map(person => {
      const joinDate = moment(person.joinDate); // Ensure joinDate is a moment object
      const totalDays = person.timePeriod.months * 30 + person.timePeriod.days; // Convert months and days to total days
      const daysPassed = moment().diff(joinDate, 'days'); // Calculate days passed since join date

      // Adjust daysLeft to account for the current day
      const daysLeft = totalDays - daysPassed - 1; // Subtract 1 for the current day

      return { ...person.toObject(), daysLeft }; // Add remaining days to each person
    });

    res.status(200).json({ message: 'People retrieved successfully', data: updatedPeople });
  } catch (error) {
    console.error('Error fetching people:', error); // Log any errors
    res.status(500).json({ message: 'Error fetching people', error: error.message });
  }
};


// Update a person
const updatePerson = async (req, res) => {
  try {
    const { id } = req.params; // Get the person ID from the request parameters
    const updatedPerson = await peopleModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedPerson) {
      return res.status(404).json({ message: 'Person not found' });
    }

    res.status(200).json({ message: 'Person updated successfully', data: updatedPerson });
  } catch (error) {
    res.status(500).json({ message: 'Error updating person', error: error.message });
  }
};

// Delete a person
const deletePerson = async (req, res) => {
  try {
    const { id } = req.params; // Get the person ID from the request parameters
    const deletedPerson = await peopleModel.findByIdAndDelete(id);

    if (!deletedPerson) {
      return res.status(404).json({ message: 'Person not found' });
    }

    res.status(200).json({ message: 'Person deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting person', error: error.message });
  }
};

// Get a person by ID
const getPersonById = async (req, res) => {
  try {
    const { id } = req.params; // Get the person ID from the request parameters
    console.log('Fetching person with ID:', id); // Log the ID being fetched

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const person = await peopleModel.findById(id); // Find the person by ID
    console.log(person);

    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    res.status(200).json({ message: 'Person retrieved successfully', data: person });
  } catch (error) {
    console.error('Error fetching person:', error); // Log any errors
    res.status(500).json({ message: 'Error fetching person', error: error.message });
  }
};

module.exports = {
  addPeople,
  getAllPeople,
  updatePerson,
  deletePerson,
  getPersonById
};
