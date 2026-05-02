const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

/**
 * Payment Routes — stubs for Razorpay/UPI integration
 * Wire up paymentController when payment gateway is configured.
 */

// @POST /api/payments/create-order
router.post('/create-order', protect, async (req, res) => {
  // TODO: Integrate Razorpay/PhonePe order creation
  res.status(200).json({ success: true, message: 'Payment gateway not yet configured', order: null });
});

// @POST /api/payments/verify
router.post('/verify', protect, async (req, res) => {
  // TODO: Verify payment signature from gateway
  res.status(200).json({ success: true, message: 'Payment verification stub' });
});

// @GET /api/payments/receipt/:tripId
router.get('/receipt/:tripId', protect, async (req, res) => {
  res.status(200).json({ success: true, message: 'Receipt stub', tripId: req.params.tripId });
});

module.exports = router;
