const Commission = require('../Models/commisionModel'); // Adjust the path as needed

// Function to add commission
const addCommission = async (req, res) => {
  try {
    const { agentName, amount, note, paymentType, transactionId, propertyId, propertyName } = req.body;

    // Find the document by propertyId
    let commissionDocument = await Commission.findOne({ propertyId });

    // Create a new commission entry
    const newCommissionEntry = {
      agentName,
      amount,
      note,
      paymentType,
      transactionId
    };

    if (!commissionDocument) {
      // If no document exists, create a new one with the commission entry
      commissionDocument = new Commission({
        propertyId,
        propertyName,
        commissions: [newCommissionEntry] // Add the first commission entry to the array
      });
    } else {
      // If document exists, push the new commission entry into the commissions array
      commissionDocument.commissions.push(newCommissionEntry);
    }

    // Save the commission document
    await commissionDocument.save();

    res.status(201).json({ message: 'Commission added successfully', commission: commissionDocument });
  } catch (error) {
    console.error('Error adding commission:', error);
    res.status(500).json({ message: 'Failed to add commission', error });
  }
};

// Function to get all commissions by property ID
const getCommissionsByPropertyId = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Find all commissions associated with the given property ID
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

    // Find the commission document by propertyId
    const commissionDocument = await Commission.findOne({ propertyId });

    if (!commissionDocument) {
      return res.status(404).json({ message: 'No commissions found for this property' });
    }

    // Filter the commissions to only include those with paymentType 'cash'
    const cashCommissions = commissionDocument.commissions.filter(entry => entry.paymentType.toLowerCase() === 'cash');

    // Calculate the total cash commission by summing up the amounts of cash entries
    const totalCashCommission = cashCommissions.reduce((total, entry) => total + entry.amount, 0);

    res.status(200).json({ propertyId, totalCashCommission });
  } catch (error) {
    console.error('Error calculating total cash commission:', error);
    res.status(500).json({ message: 'Failed to calculate total cash commission', error });
  }
};

module.exports = {
  addCommission,
  getCommissionsByPropertyId,
  updateCommission,
  deleteCommission,
  getCommissionById,
  getTotalCashCommissionByPropertyId
};
