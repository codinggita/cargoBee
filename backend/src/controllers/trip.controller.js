const Trip = require('../models/Trip');
const User = require('../models/User');
const Rating = require('../models/Rating');
const { calculateFare } = require('../utils/fareCalculator');

// @POST /api/trips  — Create a new booking
const createTrip = async (req, res) => {
  try {
    const { pickup, drop, vehicleType, cargoType, paymentMethod } = req.body;

    if (!pickup || !drop || !vehicleType) {
      return res.status(400).json({ success: false, message: 'pickup, drop, and vehicleType are required' });
    }

    // Simple straight-line distance estimate (haversine)
    const R = 6371;
    const dLat = ((drop.lat - pickup.lat) * Math.PI) / 180;
    const dLng = ((drop.lng - pickup.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((pickup.lat * Math.PI) / 180) *
        Math.cos((drop.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const distanceKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const fare = calculateFare(vehicleType, distanceKm);

    const trip = await Trip.create({
      consumerId: req.user._id,
      pickup,
      drop,
      vehicleType,
      cargoType,
      paymentMethod: paymentMethod || 'cash',
      fare,
      distance: parseFloat(distanceKm.toFixed(2)),
      status: 'searching',
    });

    // Emit via socket (handled in socket layer — emitting tripId)
    const io = req.app.get('io');
    if (io) {
      io.emit('trip:new', { tripId: trip._id, pickup, drop, vehicleType, fare });
    }

    return res.status(201).json({ success: true, trip });
  } catch (err) {
    console.error('createTrip error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/trips — Get my trips (consumer or driver)
const getMyTrips = async (req, res) => {
  try {
    const filter =
      req.user.role === 'consumer'
        ? { consumerId: req.user._id }
        : { driverId: req.user._id };

    const trips = await Trip.find(filter)
      .populate('driverId', 'name profilePic rating phone')
      .populate('vehicleId', 'name type registrationNumber')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, trips });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/trips/:id
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('consumerId', 'name phone')
      .populate('driverId', 'name phone profilePic rating')
      .populate('vehicleId', 'name type registrationNumber');

    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    return res.status(200).json({ success: true, trip });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/trips/:id/cancel
const cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    if (['completed', 'cancelled'].includes(trip.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this trip' });
    }

    trip.status = 'cancelled';
    trip.cancellationReason = req.body.reason || 'User cancelled';
    await trip.save();

    return res.status(200).json({ success: true, trip });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/trips/:id/rate
const rateTrip = async (req, res) => {
  try {
    const { score, tags, comment } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only rate completed trips' });
    }

    const ratedUserId =
      req.user.role === 'consumer' ? trip.driverId : trip.consumerId;

    const rating = await Rating.create({
      tripId: trip._id,
      raterId: req.user._id,
      ratedUserId,
      score,
      tags: tags || [],
      comment: comment || '',
    });

    // Update rated user's average rating
    const allRatings = await Rating.find({ ratedUserId });
    const avg = allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length;
    await User.findByIdAndUpdate(ratedUserId, { rating: parseFloat(avg.toFixed(1)) });

    trip.ratingId = rating._id;
    await trip.save();

    return res.status(201).json({ success: true, rating });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createTrip, getMyTrips, getTripById, cancelTrip, rateTrip };
