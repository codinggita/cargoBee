const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getVehicles, addVehicle, getVehicleById, updateVehicleStatus } = require('../controllers/vehicle.controller');

router.use(protect);

router.get('/', getVehicles);
router.post('/', addVehicle);
router.get('/:id', getVehicleById);
router.put('/:id/status', updateVehicleStatus);

module.exports = router;
