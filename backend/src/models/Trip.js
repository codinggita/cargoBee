const mongoose = require('mongoose');

const coordinatesSchema = new mongoose.Schema({
  address: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
}, { _id: false });

const tripSchema = new mongoose.Schema(
  {
    consumerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driverId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vehicleId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },

    status: {
      type: String,
      enum: ['searching', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'searching',
    },

    pickup: { type: coordinatesSchema, required: true },
    drop:   { type: coordinatesSchema, required: true },

    vehicleType: { type: String, required: true }, // e.g. "Mini Truck"
    cargoType:   { type: String, default: '' },    // e.g. "Furniture"

    fare: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ['wallet', 'upi', 'cash'], default: 'cash' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },

    distance: { type: Number, default: 0 }, // km
    duration: { type: Number, default: 0 }, // minutes

    startTime: { type: Date },
    endTime:   { type: Date },

    cancellationReason: { type: String },
    ratingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rating' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
