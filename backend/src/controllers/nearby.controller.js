const User = require('../models/User');

/**
 * Haversine formula — returns distance in km between two lat/lng points
 */
const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * GET /api/drivers/nearby?lat=&lng=&radius=&vehicleType=
 * Returns online drivers within `radius` km (default 5 km)
 */
const getNearbyDrivers = async (req, res) => {
  try {
    const { lat, lng, radius = 5, vehicleType } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'lat and lng query params are required',
      });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxKm   = parseFloat(radius);

    // Fetch all online drivers with a stored location
    const filter = { role: 'driver', isOnline: true, 'currentLocation.lat': { $exists: true } };
    if (vehicleType) filter['vehicleType'] = vehicleType;

    const drivers = await User.find(filter).select(
      'name profilePic rating currentLocation vehicleId isOnline'
    );

    // Filter by distance
    const nearby = drivers
      .map((d) => {
        const dist = haversineKm(
          userLat, userLng,
          d.currentLocation.lat, d.currentLocation.lng
        );
        return { ...d.toJSON(), distanceKm: parseFloat(dist.toFixed(2)) };
      })
      .filter((d) => d.distanceKm <= maxKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return res.status(200).json({
      success: true,
      count: nearby.length,
      drivers: nearby,
    });
  } catch (err) {
    console.error('getNearbyDrivers error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getNearbyDrivers };
