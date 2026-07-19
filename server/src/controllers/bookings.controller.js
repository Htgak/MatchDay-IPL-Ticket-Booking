const db = require('../db');
const AppError = require('../utils/AppError');
const LockService = require('../services/lockService');
const z = require('zod');

exports.getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT b.id as booking_id, b.total_amount, b.status as booking_status, b.created_at,
             m.id as match_id, m.date as match_date, m.status as match_status,
             ta.name as ta_name, ta.short_code as ta_short, ta.logo_url as ta_logo,
             tb.name as tb_name, tb.short_code as tb_short, tb.logo_url as tb_logo,
             s.name as stadium_name, s.city as stadium_city,
             bs.id as booking_seat_id,
             ms.id as match_seat_id, ms.price as match_seat_price,
             st.seat_number, r.name as row_name,
             blk.name as block_name, blk.category as block_category, blk.color_code as block_color,
             stnd.name as stand_name,
             t.qr_token, t.is_valid as ticket_valid
      FROM "Bookings" b
      JOIN "Matches" m ON b.match_id = m.id
      JOIN "Teams" ta ON m.team_a = ta.id
      JOIN "Teams" tb ON m.team_b = tb.id
      JOIN "Stadiums" s ON m.stadium_id = s.id
      LEFT JOIN "BookingSeats" bs ON bs.booking_id = b.id
      LEFT JOIN "MatchSeats" ms ON bs.match_seat_id = ms.id
      LEFT JOIN "Seats" st ON ms.seat_id = st.id
      LEFT JOIN "Rows" r ON st.row_id = r.id
      LEFT JOIN "Blocks" blk ON r.block_id = blk.id
      LEFT JOIN "Stands" stnd ON blk.stand_id = stnd.id
      LEFT JOIN "Tickets" t ON t.booking_seat_id = bs.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC;
    `;

    const { rows } = await db.query(query, [userId]);

    // Group rows into bookings
    const bookingsMap = {};
    rows.forEach(row => {
      if (!bookingsMap[row.booking_id]) {
        bookingsMap[row.booking_id] = {
          id: row.booking_id,
          total_amount: row.total_amount,
          status: row.booking_status,
          created_at: row.created_at,
          match: {
            id: row.match_id,
            match_date: row.match_date,
            status: row.match_status,
            team_a: { name: row.ta_name, short_code: row.ta_short, logo_url: row.ta_logo },
            team_b: { name: row.tb_name, short_code: row.tb_short, logo_url: row.tb_logo },
            stadium: { name: row.stadium_name, city: row.stadium_city }
          },
          seats: []
        };
      }
      if (row.booking_seat_id) {
        bookingsMap[row.booking_id].seats.push({
          id: row.booking_seat_id,
          match_seat: {
            id: row.match_seat_id,
            price: row.match_seat_price,
            seat: {
              seat_number: row.seat_number,
              row: {
                name: row.row_name,
                block: {
                  name: row.block_name, category: row.block_category, color_code: row.block_color,
                  stand: { name: row.stand_name }
                }
              }
            }
          },
          ticket: row.qr_token ? { qr_token: row.qr_token, is_valid: row.ticket_valid } : null
        });
      }
    });

    const data = Object.values(bookingsMap);

    res.status(200).json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

const createBookingSchema = z.object({
  matchId: z.string().uuid(),
  seatIds: z.array(z.string().uuid()).min(1).max(6),
});

exports.createBooking = async (req, res, next) => {
  try {
    const { matchId, seatIds } = createBookingSchema.parse(req.body);
    const userId = req.user.id;

    for (const matchSeatId of seatIds) {
      const owner = await LockService.getLockOwner(matchId, matchSeatId);
      if (owner !== userId) {
        throw new AppError(`Seat lock expired or missing for seat ${matchSeatId}`, 400);
      }
    }

    const { rows: matchSeats } = await db.query('SELECT id, price, status FROM "MatchSeats" WHERE match_id = $1 AND id = ANY($2::uuid[])', [matchId, seatIds]);

    if (matchSeats.length !== seatIds.length) {
      throw new AppError('One or more seats not found', 400);
    }

    const totalAmount = matchSeats.reduce((sum, seat) => sum + Number(seat.price), 0);

    const { rows: bookingRows } = await db.query(
      'INSERT INTO "Bookings" (user_id, match_id, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, matchId, totalAmount, 'PENDING']
    );
    const bookingId = bookingRows[0].id;

    for (const seatId of seatIds) {
      await db.query('INSERT INTO "BookingSeats" (booking_id, match_seat_id) VALUES ($1, $2)', [bookingId, seatId]);
    }

    await db.query('UPDATE "MatchSeats" SET status = $1, locked_by = $2 WHERE id = ANY($3::uuid[])', ['LOCKED', userId, seatIds]);

    res.status(201).json({
      status: 'success',
      data: { bookingId, totalAmount }
    });
  } catch (err) {
    next(err);
  }
};
