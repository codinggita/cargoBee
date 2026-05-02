require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const connectDB = require('./src/config/db');
const { initSockets } = require('./src/sockets/trip.socket');

// Route imports
const authRoutes    = require('./src/routes/auth.routes');
const userRoutes    = require('./src/routes/user.routes');
const tripRoutes    = require('./src/routes/trip.routes');
const driverRoutes  = require('./src/routes/driver.routes');
const driversRoutes = require('./src/routes/drivers.routes');
const vehicleRoutes = require('./src/routes/vehicle.routes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = http.createServer(app);

// ─── Socket.IO ────────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
initSockets(io);
app.set('io', io);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CargoBee API is running',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/user',     userRoutes);
app.use('/api/trips',    tripRoutes);
app.use('/api/driver',   driverRoutes);
app.use('/api/drivers',  driversRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global error handler ────────────────────────────────────────────────────
const { errorHandler } = require('./src/middleware/errorHandler');
app.use(errorHandler);

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`\nCargoBee API running on http://localhost:${PORT}`);
  console.log(`Socket.IO ready`);
  console.log(`Environment: ${process.env.NODE_ENV}\n`);
});
