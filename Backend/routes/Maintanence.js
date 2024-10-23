const express = require('express');

const router = express.Router();
const MaintenanceController = require('../controller/MaintanenceController');


let io;
// Function to set the Socket.IO instance
const setMaintenanceSocketIO = (socketIo) => {
  io = socketIo;
};

// Add maintenance request
router.post('/add', async (req, res) => {
  try {
    const newMaintenance = await MaintenanceController.addMaintenance(req, res);

    if (newMaintenance) {
      io.emit('maintenanceUpdated', newMaintenance); // Emit the new maintenance request
    } else {
      console.error('Failed to get the new maintenance request from the controller');
    }
  } catch (error) {
    console.error('Error adding maintenance:', error);
    res.status(500).json({ error: 'Failed to add maintenance' });
  }
});

router.get("/total",MaintenanceController.getTotalMaintenance );

router.get("/get",MaintenanceController.getAllMaintenance );

router.delete("/delete/:id",MaintenanceController.deleteMaintenanceById );

router.get("/get/:id",MaintenanceController.getMaintenanceById);

router.get('/maintenance/status', MaintenanceController.getMaintenanceByStatus);

router.put('/assign/:id',MaintenanceController.assignStaffToMaintenance);

router.put('/update-assigned-to/:id', MaintenanceController.updateAssignedTo);

router.put('/updateStatus/:id',MaintenanceController.updateMaintenanceStatus)

router.get('/getlatest',MaintenanceController.getLatestResolvedIssues)



module.exports = { router, setMaintenanceSocketIO };