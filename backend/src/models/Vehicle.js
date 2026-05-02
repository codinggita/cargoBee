const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:    { type: String, required: true },
    type:    { type: String, required: true }, // "Mini Truck", "Tempo", etc.
    registrationNumber: { type: String, required: true, unique: true, uppercase: true },
    capacity: { type: String, default: '750 kg' }, // e.g. "1.5 Ton"
    status: {
      type: String,
      enum: ['available', 'on_trip', 'maintenance'],
      default: 'available',
    },
    rating: { type: Number, default: 5.0 },
    photo:  { type: String, default: '' }, // Cloudinary URL
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
