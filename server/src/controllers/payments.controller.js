const Razorpay = require('razorpay');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../db');
const AppError = require('../utils/AppError');
const env = require('../config/env');
const z = require('zod');

let razorpayInstance;
if (env.razorpay.keyId && env.razorpay.keySecret) {
  razorpayInstance = new Razorpay({
    key_id: env.razorpay.keyId,
    key_secret: env.razorpay.keySecret,
  });
}

const createOrderSchema = z.object({
  bookingId: z.string().uuid()
});

exports.createOrder = async (req, res, next) => {
  try {
    if (!razorpayInstance) throw new AppError('Razorpay not configured', 500);

    const { bookingId } = createOrderSchema.parse(req.body);
    const userId = req.user.id;

    const { rows: bookingRows } = await db.query('SELECT * FROM "Bookings" WHERE id = $1 AND user_id = $2', [bookingId, userId]);
    
    if (bookingRows.length === 0) throw new AppError('Booking not found', 404);
    const booking = bookingRows[0];
    
    if (booking.status !== 'PENDING') throw new AppError(`Booking is ${booking.status}`, 400);

    const options = {
      amount: Math.round(booking.total_amount * 100), // amount in the smallest currency unit
      currency: 'INR',
      receipt: bookingId,
    };

    const order = await razorpayInstance.orders.create(options);

    await db.query(
      'INSERT INTO "Payments" (booking_id, razorpay_order_id, amount, status) VALUES ($1, $2, $3, $4)',
      [bookingId, order.id, booking.total_amount, 'PENDING']
    );

    res.status(200).json({ status: 'success', data: { orderId: order.id, amount: order.amount, keyId: env.razorpay.keyId } });
  } catch (err) {
    next(err);
  }
};

const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  bookingId: z.string().uuid()
});

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = verifyPaymentSchema.parse(req.body);
    const userId = req.user.id;

    // Verify booking ownership
    const { rows: bookingRows } = await db.query('SELECT id FROM "Bookings" WHERE id = $1 AND user_id = $2', [bookingId, userId]);
    if (bookingRows.length === 0) {
      throw new AppError('Booking not found or does not belong to your account', 404);
    }

    const hmac = crypto.createHmac('sha256', env.razorpay.keySecret);
    hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpaySignature) {
      throw new AppError('Invalid payment signature', 400);
    }

    // 1. Update Payment status
    await db.query(
      'UPDATE "Payments" SET status = $1, razorpay_payment_id = $2 WHERE razorpay_order_id = $3',
      ['SUCCESS', razorpayPaymentId, razorpayOrderId]
    );

    // 2. Update Booking status
    await db.query('UPDATE "Bookings" SET status = $1 WHERE id = $2', ['CONFIRMED', bookingId]);

    // 3. Get BookingSeats
    const { rows: bookingSeats } = await db.query('SELECT id, match_seat_id FROM "BookingSeats" WHERE booking_id = $1', [bookingId]);
    const matchSeatIds = bookingSeats.map(bs => bs.match_seat_id);
    
    // 4. Update MatchSeats
    await db.query(
      'UPDATE "MatchSeats" SET status = $1, locked_by = NULL, locked_until = NULL WHERE id = ANY($2::uuid[])',
      ['BOOKED', matchSeatIds]
    );

    // Broadcast WebSocket event
    const { rows: bookingDetails } = await db.query('SELECT match_id FROM "Bookings" WHERE id = $1', [bookingId]);
    const io = req.app.get('io');
    if (io && bookingDetails.length > 0) {
      io.to(`match_${bookingDetails[0].match_id}`).emit('seat_booked', {
        matchId: bookingDetails[0].match_id,
        matchSeatIds
      });
    }

    // Generate Tickets
    for (const bs of bookingSeats) {
      const qrToken = jwt.sign(
        { bookingId, bookingSeatId: bs.id },
        env.jwt.secret || 'matchday_secret_key',
        { expiresIn: env.jwt.expiresIn || '24h' }
      );
      
      await db.query(
        'INSERT INTO "Tickets" (booking_seat_id, qr_token, is_valid) VALUES ($1, $2, $3)',
        [bs.id, qrToken, true]
      );
    }

    res.status(200).json({ status: 'success', message: 'Payment verified and tickets generated' });
  } catch (err) {
    next(err);
  }
};
