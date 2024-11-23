const express = require('express');
const router = express.Router();
const MaintenanceController = require('../controller/MaintanenceController');
const { verifyToken } = require('../middleware/tokenVerify');

// Add maintenance request
router.post('/add', verifyToken, MaintenanceController.addMaintenance)

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



module.exports = router;