const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const env = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');
const { createAdapter } = require('@socket.io/redis-adapter');
const redis = require('./config/redis');

// Route imports
const matchesRoutes = require('./routes/matches.routes');
const bookingsRoutes = require('./routes/bookings.routes');
const paymentsRoutes = require('./routes/payments.routes');
const adminRoutes = require('./routes/admin.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();
const server = http.createServer(app);

const subClient = redis.duplicate();

const io = new Server(server, {
  cors: {
    origin: '*', // Configure properly in production
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  },
  adapter: createAdapter(redis, subClient)
});

// Middleware
app.use(cors());
app.use(express.json());

// Set up socket.io globally if needed, or pass to controllers
app.set('io', io);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Clients will join a room specific to the match they are viewing
  socket.on('join_match', (matchId) => {
    socket.join(`match_${matchId}`);
    console.log(`Socket ${socket.id} joined match_${matchId}`);
  });

  socket.on('leave_match', (matchId) => {
    socket.leave(`match_${matchId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// Error handling middleware (must be at the end)
app.use(errorHandler);

const PORT = env.port || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${env.nodeEnv} mode on port ${PORT}`);
});