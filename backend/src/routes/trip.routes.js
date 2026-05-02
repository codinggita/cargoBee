const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createTrip, getMyTrips, getTripById, cancelTrip, rateTrip } = require('../controllers/trip.controller');

router.use(protect);

router.post('/', createTrip);
router.get('/', getMyTrips);
router.get('/:id', getTripById);
router.put('/:id/cancel', cancelTrip);
router.post('/:id/rate', rateTrip);

module.exports = router;
