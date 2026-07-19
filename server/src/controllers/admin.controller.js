const db = require('../db');
const AppError = require('../utils/AppError');
const z = require('zod');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const { rows: userRows } = await db.query('SELECT COUNT(*) as count FROM "Users"');
    const totalUsers = parseInt(userRows[0].count, 10);
    
    const { rows: bookingRows } = await db.query(
      'SELECT SUM(total_amount) as revenue, COUNT(*) as count FROM "Bookings" WHERE status = $1',
      ['CONFIRMED']
    );
    
    const totalRevenue = parseFloat(bookingRows[0].revenue) || 0;
    const totalBookings = parseInt(bookingRows[0].count, 10) || 0;

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        totalBookings,
        totalRevenue
      }
    });
  } catch (err) {
    next(err);
  }
};

const createMatchSchema = z.object({
  team_a_id: z.string().uuid(),
  team_b_id: z.string().uuid(),
  stadium_id: z.string().uuid(),
  match_date: z.string().datetime()
});

exports.createMatch = async (req, res, next) => {
  try {
    const { team_a_id, team_b_id, stadium_id, match_date } = createMatchSchema.parse(req.body);

    const { rows: matchRows } = await db.query(
      'INSERT INTO "Matches" (team_a, team_b, stadium_id, date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [team_a_id, team_b_id, stadium_id, match_date, 'UPCOMING']
    );
    const match = matchRows[0];

    // Initialize MatchSeats based on stadium's seats
    await db.query(`
      INSERT INTO "MatchSeats" (match_id, seat_id, status, price)
      SELECT $1, s.id, 'AVAILABLE', b.price
      FROM "Seats" s
      JOIN "Rows" r ON r.id = s.row_id
      JOIN "Blocks" b ON b.id = r.block_id
      JOIN "Stands" st ON st.id = b.stand_id
      WHERE st.stadium_id = $2
    `, [match.id, stadium_id]);

    res.status(201).json({ status: 'success', data: match });
  } catch (err) {
    next(err);
  }
};
