const Vehicle = require('../models/Vehicle');

// @GET /api/vehicles
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ ownerId: req.user._id });
    return res.status(200).json({ success: true, vehicles });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/vehicles
const addVehicle = async (req, res) => {
  try {
    const { name, type, registrationNumber, capacity } = req.body;
    if (!name || !type || !registrationNumber) {
      return res.status(400).json({ success: false, message: 'name, type, and registrationNumber are required' });
    }

    const vehicle = await Vehicle.create({
      ownerId: req.user._id,
      name,
      type,
      registrationNumber,
      capacity: capacity || '750 kg',
    });

    return res.status(201).json({ success: true, vehicle });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Vehicle with this registration number already exists' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/vehicles/:id
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    return res.status(200).json({ success: true, vehicle });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/vehicles/:id/status
const updateVehicleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    return res.status(200).json({ success: true, vehicle });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getVehicles, addVehicle, getVehicleById, updateVehicleStatus };
