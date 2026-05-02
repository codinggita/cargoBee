const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { getDashboard, updateStatus, getEarnings, acceptTrip, completeTrip } = require('../controllers/driver.controller');

router.use(protect, requireRole('driver'));

router.get('/dashboard', getDashboard);
router.put('/status', updateStatus);
router.get('/earnings', getEarnings);
router.put('/trips/:id/accept', acceptTrip);
router.put('/trips/:id/complete', completeTrip);

module.exports = router;
