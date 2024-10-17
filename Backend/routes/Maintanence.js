const express = require('express');

const router = express.Router();
const MaintanaceController = require('../controller/MaintanenceController');


router.post("/add",MaintanaceController.addMaintenance);

router.get("/total",MaintanaceController.getTotalMaintenance );

router.get("/get",MaintanaceController.getAllMaintenance );

router.delete("/delete/:id",MaintanaceController.deleteMaintenanceById );

router.get("/get/:id",MaintanaceController.getMaintenanceById);

router.get('/maintenance/status', MaintanaceController.getMaintenanceByStatus);

router.put('/assign/:id',MaintanaceController.assignStaffToMaintenance);

router.put('/update-assigned-to/:id', MaintanaceController.updateAssignedTo);



module.exports =router;