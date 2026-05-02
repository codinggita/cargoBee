const mongoose = require('mongoose');

/**
 * Driver model — extends the base User concept for driver-specific fields.
 * This is kept separate from User.js to match the target project structure.
 * In practice, the 'User' model handles both roles, but this model can be
 * used for driver-only queries and populates.
 */
const driverSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    vehicleType: { type: String, required: true },
    vehicleNumber: { type: String, required: true, uppercase: true, trim: true },
    licenseNumber: { type: String, required: true },
    licenseDoc: { type: String, default: '' }, // Cloudinary URL
    isOnline: { type: Boolean, default: false },
    currentLocation: { lat: Number, lng: Number },
    rating: { type: Number, default: 5.0 },
    totalTrips: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Driver', driverSchema);
