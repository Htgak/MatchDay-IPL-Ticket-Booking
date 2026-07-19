const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookings.controller');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware); // All booking routes require authentication

router.get('/', bookingsController.getUserBookings);
router.post('/', bookingsController.createBooking);

module.exports = router;
