const User = require('../models/User');
const Trip = require('../models/Trip');
const Rating = require('../models/Rating');

// @GET /api/driver/dashboard — driver overview stats
const getDashboard = async (req, res) => {
  try {
    const driver = await User.findById(req.user._id).select(
      'name profilePic rating totalTrips totalEarnings isOnline vehicleId'
    );

    // Today's trips
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayTrips = await Trip.find({
      driverId: req.user._id,
      status: 'completed',
      endTime: { $gte: startOfDay },
    });

    const todayEarnings = todayTrips.reduce((sum, t) => sum + t.fare, 0);
    const totalDistanceToday = todayTrips.reduce((sum, t) => sum + (t.distance || 0), 0);

    const recentTrips = await Trip.find({ driverId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('consumerId', 'name');

    return res.status(200).json({
      success: true,
      driver,
      stats: {
        todayEarnings,
        todayTrips: todayTrips.length,
        totalDistanceToday: parseFloat(totalDistanceToday.toFixed(1)),
        rating: driver.rating,
        totalTrips: driver.totalTrips,
        totalEarnings: driver.totalEarnings,
      },
      recentTrips,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/driver/status — toggle online/offline
const updateStatus = async (req, res) => {
  try {
    const { isOnline, lat, lng } = req.body;
    const update = { isOnline };
    if (lat && lng) update.currentLocation = { lat, lng };

    const driver = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select(
      'isOnline currentLocation'
    );

    // Notify via socket
    const io = req.app.get('io');
    if (io) {
      io.emit(isOnline ? 'driver:online' : 'driver:offline', { driverId: req.user._id });
    }

    return res.status(200).json({ success: true, isOnline: driver.isOnline });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/driver/earnings
const getEarnings = async (req, res) => {
  try {
    const { period } = req.query; // 'week' | 'month' | 'all'

    let startDate = new Date(0);
    if (period === 'week') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const trips = await Trip.find({
      driverId: req.user._id,
      status: 'completed',
      endTime: { $gte: startDate },
    }).sort({ endTime: -1 });

    const total = trips.reduce((sum, t) => sum + t.fare, 0);

    return res.status(200).json({ success: true, earnings: total, trips });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/driver/trips/:id/accept
const acceptTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.status !== 'searching') {
      return res.status(400).json({ success: false, message: 'Trip is no longer available' });
    }

    trip.driverId = req.user._id;
    trip.status = 'confirmed';
    await trip.save();

    // Notify consumer via socket
    const io = req.app.get('io');
    if (io) {
      io.to(`trip:${trip._id}`).emit('trip:accepted', {
        tripId: trip._id,
        driver: {
          id: req.user._id,
          name: req.user.name,
          profilePic: req.user.profilePic,
          rating: req.user.rating,
          phone: req.user.phone,
        },
      });
    }

    return res.status(200).json({ success: true, trip });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/driver/trips/:id/complete
const completeTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    trip.status = 'completed';
    trip.endTime = new Date();
    await trip.save();

    // Update driver stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalTrips: 1, totalEarnings: trip.fare },
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`trip:${trip._id}`).emit('trip:completed', { tripId: trip._id, fare: trip.fare });
    }

    return res.status(200).json({ success: true, trip });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDashboard, updateStatus, getEarnings, acceptTrip, completeTrip };
