const express = require('express');

const router = express.Router();
const MaintenanceController = require('../controller/MaintanenceController');
const { verifyToken } = require('../middleware/tokenVerify');


let io;
// Function to set the Socket.IO instance
const setMaintenanceSocketIO = (socketIo) => {
  io = socketIo;
};

// Add maintenance request
router.post('/add', verifyToken, async (req, res) => {
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

router.get("/total", verifyToken, MaintenanceController.getTotalMaintenance );

router.get("/get", verifyToken, MaintenanceController.getAllMaintenance );

router.delete("/delete/:id", verifyToken, MaintenanceController.deleteMaintenanceById );

router.get("/get/:id", verifyToken, MaintenanceController.getMaintenanceById);

router.get('/maintenance/status', verifyToken, MaintenanceController.getMaintenanceByStatus);

router.put('/assign/:id', verifyToken, MaintenanceController.assignStaffToMaintenance);

router.put('/update-assigned-to/:id', verifyToken, MaintenanceController.updateAssignedTo);

router.put('/updateStatus/:id', verifyToken, MaintenanceController.updateMaintenanceStatus)

router.get('/getlatest', verifyToken, MaintenanceController.getLatestResolvedIssues)

router.get('/student/:studentId', MaintenanceController.getMaintenanceByStudentId);



module.exports = { router, setMaintenanceSocketIO };