const Commission = require('../Models/commisionModel'); 


const addCommission = async (req, res) => {
  try {
    const { agentName, amount, note, paymentType, transactionId, propertyId, propertyName } = req.body;


    const newCommissionEntry = new Commission({
      agentName,
      amount,
      note,
      paymentType,
      transactionId,
      propertyId,
      propertyName,
    });


    await newCommissionEntry.save();

    res.status(201).json({ message: 'Commission added successfully', commission: newCommissionEntry });
  } catch (error) {
    console.error('Error adding commission:', error);
    res.status(500).json({ message: 'Failed to add commission', error });
  }
};


const getCommissionsByPropertyId = async (req, res) => {
  try {
    const { propertyId } = req.params;

  
    const commissions = await Commission.find({ propertyId });

    if (commissions.length === 0) {
      return res.status(404).json({ message: 'No commissions found for this property' });
    }

    res.status(200).json(commissions); // Return the commissions
  } catch (error) {
    console.error('Error getting commissions:', error);
    res.status(500).json({ message: 'Failed to get commissions', error });
  }
};

// Function to update a commission by ID
const updateCommission = async (req, res) => {
  try {
    const { commissionId } = req.params; // Get commission ID from URL parameters
    const updatedData = req.body; // Get the updated data from the request body

    // Find and update the commission
    const updatedCommission = await Commission.findByIdAndUpdate(commissionId, updatedData, { new: true });

    if (!updatedCommission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    res.status(200).json({ message: 'Commission updated successfully', commission: updatedCommission });
  } catch (error) {
    console.error('Error updating commission:', error);
    res.status(500).json({ message: 'Failed to update commission', error });
  }
};

// Function to delete a commission by ID
const deleteCommission = async (req, res) => {
  try {
    const { commissionId } = req.params; // Get commission ID from URL parameters

    // Find and delete the commission
    const deletedCommission = await Commission.findByIdAndDelete(commissionId);

    if (!deletedCommission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    res.status(200).json({ message: 'Commission deleted successfully' });
  } catch (error) {
    console.error('Error deleting commission:', error);
    res.status(500).json({ message: 'Failed to delete commission', error });
  }
};

// Function to get a commission by ID
const getCommissionById = async (req, res) => {
  try {
    const { commissionId } = req.params; // Get commission ID from URL parameters

    // Find the commission by ID
    const commission = await Commission.findById(commissionId);

    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    res.status(200).json(commission);
  } catch (error) {
    console.error('Error getting commission:', error);
    res.status(500).json({ message: 'Failed to get commission', error });
  }
};

// Function to get total cash commission by property ID
const getTotalCashCommissionByPropertyId = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Find all commissions associated with the given property ID
    const commissions = await Commission.find({ propertyId });

    if (commissions.length === 0) {
      return res.status(404).json({ message: 'No commissions found for this property' });
    }

    // Filter the commissions to only include those with paymentType 'cash'
    const cashCommissions = commissions.filter(entry => entry.paymentType.toLowerCase() === 'cash');

    // Calculate the total cash commission by summing up the amounts of cash entries
    const totalCashCommission = cashCommissions.reduce((total, entry) => total + entry.amount, 0);

    res.status(200).json({ propertyId, totalCashCommission });
  } catch (error) {
    console.error('Error calculating total cash commission:', error);
    res.status(500).json({ message: 'Failed to calculate total cash commission', error });
  }
};
const getAllCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find(); // Fetch all commissions

    if (commissions.length === 0) {
      return res.status(404).json({ message: 'No commissions found' });
    }

    res.status(200).json(commissions); // Return the list of commissions
  } catch (error) {
    console.error('Error getting all commissions:', error);
    res.status(500).json({ message: 'Failed to get all commissions', error });
  }
};
const getTotalCommission = async (req, res) => {
  try {
    // Aggregate to sum up all commission amounts
    const totalCommission = await Commission.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);

    // Send the total commission amount as a response
    res.status(200).json({ totalCommission: totalCommission[0]?.totalAmount || 0 });
  } catch (error) {
    console.error('Error fetching total commission:', error);
    res.status(500).json({ message: 'Failed to fetch total commission', error });
  }
};


module.exports = {
  addCommission,
  getCommissionsByPropertyId,
  updateCommission,
  deleteCommission,
  getCommissionById,
  getTotalCashCommissionByPropertyId,
  getAllCommissions,
  getTotalCommission
};
