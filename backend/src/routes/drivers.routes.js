const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getNearbyDrivers } = require('../controllers/nearby.controller');

// GET /api/drivers/nearby?lat=&lng=&radius=&vehicleType=
router.get('/nearby', protect, getNearbyDrivers);

module.exports = router;
