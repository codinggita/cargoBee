const mongoose = require('mongoose');

/**
 * Booking model — represents a booking request before it becomes an active trip.
 * Maps to the 'Booking' model in the target spec.
 * (Trip.js handles the active/completed lifecycle)
 */
const fareBreakdownSchema = new mongoose.Schema({
  baseFare:       { type: Number, default: 0 },
  distanceCharge: { type: Number, default: 0 },
  gst:            { type: Number, default: 0 },
  total:          { type: Number, default: 0 },
}, { _id: false });

const bookingSchema = new mongoose.Schema(
  {
    consumerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pickup: {
      address: { type: String, required: true },
      lat:     { type: Number, required: true },
      lng:     { type: Number, required: true },
    },
    drop: {
      address: { type: String, required: true },
      lat:     { type: Number, required: true },
      lng:     { type: Number, required: true },
    },
    vehicle:       { type: String, required: true }, // "Mini Truck"
    cargoTypes:    [{ type: String }],
    fareBreakdown: fareBreakdownSchema,
    paymentMethod: { type: String, enum: ['wallet', 'upi', 'cash'], default: 'cash' },
    status: {
      type: String,
      enum: ['pending', 'searching', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }, // set once driver accepted
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
