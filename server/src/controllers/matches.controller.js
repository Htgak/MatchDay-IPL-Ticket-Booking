const db = require('../db');
const AppError = require('../utils/AppError');
const LockService = require('../services/lockService');
const QueueService = require('../services/queueService');
const z = require('zod');

const mapMatchRow = (row) => ({
  id: row.id,
  match_date: row.match_date || row.date,
  status: row.status,
  team_a: { id: row.team_a_id, name: row.team_a_name, short_code: row.team_a_short, logo_url: row.team_a_logo },
  team_b: { id: row.team_b_id, name: row.team_b_name, short_code: row.team_b_short, logo_url: row.team_b_logo },
  stadium: { id: row.stadium_id, name: row.stadium_name, city: row.stadium_city, total_capacity: row.stadium_capacity }
});

const MATCHES_QUERY = `
  SELECT m.id, m.date as match_date, m.status, 
         t1.id as team_a_id, t1.name as team_a_name, t1.short_code as team_a_short, t1.logo_url as team_a_logo,
         t2.id as team_b_id, t2.name as team_b_name, t2.short_code as team_b_short, t2.logo_url as team_b_logo,
         s.id as stadium_id, s.name as stadium_name, s.city as stadium_city, s.capacity as stadium_capacity
  FROM "Matches" m
  JOIN "Teams" t1 ON m.team_a = t1.id
  JOIN "Teams" t2 ON m.team_b = t2.id
  JOIN "Stadiums" s ON m.stadium_id = s.id
`;

exports.getMatches = async (req, res, next) => {
  try {
    const { rows } = await db.query(`${MATCHES_QUERY} ORDER BY m.date ASC`);
    res.status(200).json({ status: 'success', data: rows.map(mapMatchRow) });
  } catch (err) {
    next(err);
  }
};

exports.getMatchDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`${MATCHES_QUERY} WHERE m.id = $1`, [id]);
    
    if (rows.length === 0) throw new AppError('Match not found', 404);
    res.status(200).json({ status: 'success', data: mapMatchRow(rows[0]) });
  } catch (err) {
    next(err);
  }
};

exports.getStands = async (req, res, next) => {
  try {
    const { id: matchId } = req.params;

    const { rows: matchRows } = await db.query('SELECT stadium_id FROM "Matches" WHERE id = $1', [matchId]);
    if (matchRows.length === 0) throw new AppError('Match not found', 404);
    const stadiumId = matchRows[0].stadium_id;

    const { rows: stands } = await db.query('SELECT id, name, position FROM "Stands" WHERE stadium_id = $1 ORDER BY name', [stadiumId]);

    // Aggregate available seats by block
    const { rows: blockCountsQuery } = await db.query(`
      SELECT r.block_id, COUNT(ms.id) as count
      FROM "MatchSeats" ms
      JOIN "Seats" s ON s.id = ms.seat_id
      JOIN "Rows" r ON r.id = s.row_id
      WHERE ms.match_id = $1 AND ms.status = 'AVAILABLE'
      GROUP BY r.block_id
    `, [matchId]);

    const blockCounts = {};
    blockCountsQuery.forEach(row => {
      blockCounts[row.block_id] = parseInt(row.count, 10);
    });

    const { rows: allBlocks } = await db.query('SELECT id, stand_id, name, price, category, color_code FROM "Blocks" ORDER BY price');

    const standsWithStats = stands.map(stand => {
      const standBlocks = allBlocks.filter(b => b.stand_id === stand.id).map(b => ({
        ...b,
        available_seats: blockCounts[b.id] || 0
      }));

      const prices = standBlocks.map(b => Number(b.price));
      return {
        ...stand,
        price_from: prices.length ? Math.min(...prices) : 0,
        price_to: prices.length ? Math.max(...prices) : 0,
        block_count: standBlocks.length,
        categories: [...new Set(standBlocks.map(b => b.category))],
        blocks: standBlocks
      };
    });

    res.status(200).json({ status: 'success', data: standsWithStats });
  } catch (err) {
    next(err);
  }
};

exports.getBlocks = async (req, res, next) => {
  try {
    const { id: matchId, standId } = req.params;

    const { rows: blocks } = await db.query('SELECT id, name, category, color_code, price FROM "Blocks" WHERE stand_id = $1 ORDER BY name', [standId]);

    const blocksWithAvailability = await Promise.all(blocks.map(async (block) => {
      const { rows: stats } = await db.query(`
        SELECT 
          COUNT(ms.id) as total,
          SUM(CASE WHEN ms.status = 'AVAILABLE' THEN 1 ELSE 0 END) as available
        FROM "MatchSeats" ms
        JOIN "Seats" s ON s.id = ms.seat_id
        JOIN "Rows" r ON r.id = s.row_id
        WHERE ms.match_id = $1 AND r.block_id = $2
      `, [matchId, block.id]);

      return {
        ...block,
        total_seats: parseInt(stats[0].total, 10) || 0,
        available_seats: parseInt(stats[0].available, 10) || 0
      };
    }));

    res.status(200).json({ status: 'success', data: blocksWithAvailability });
  } catch (err) {
    next(err);
  }
};

exports.getBlockSeats = async (req, res, next) => {
  try {
    const { id: matchId, blockId } = req.params;

    const { rows: blockRows } = await db.query('SELECT id, name, category, color_code, price FROM "Blocks" WHERE id = $1', [blockId]);
    if (blockRows.length === 0) throw new AppError('Block not found', 404);
    const block = blockRows[0];

    const { rows: rowsData } = await db.query('SELECT id, name FROM "Rows" WHERE block_id = $1 ORDER BY name', [blockId]);
    
    // Group seats by row natively using a join
    const { rows: seatRows } = await db.query(`
      SELECT s.id, s.seat_number, s.row_id, s.x, s.y,
             ms.id as match_seat_id, ms.status, ms.locked_by, ms.locked_until, ms.price
      FROM "Seats" s
      LEFT JOIN "MatchSeats" ms ON ms.seat_id = s.id AND ms.match_id = $1
      WHERE s.row_id = ANY($2::uuid[])
      ORDER BY s.seat_number
    `, [matchId, rowsData.map(r => r.id)]);

    const rowMap = {};
    rowsData.forEach(row => { rowMap[row.id] = { id: row.id, name: row.name, seats: [] }; });

    seatRows.forEach(seat => {
      if (rowMap[seat.row_id]) {
        rowMap[seat.row_id].seats.push({
          id: seat.id,
          seat_number: seat.seat_number,
          x: seat.x,
          y: seat.y,
          match_seat_id: seat.match_seat_id || null,
          status: seat.status || 'UNAVAILABLE',
          price: Number(seat.price || block.price)
        });
      }
    });

    const processedRows = Object.values(rowMap).sort((a, b) => a.name.localeCompare(b.name));
    res.status(200).json({ status: 'success', data: { block, rows: processedRows } });
  } catch (err) {
    next(err);
  }
};

exports.getMatchSeats = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Note: getMatchSeats legacy query is complex. Keeping minimal for compatibility.
    const { rows } = await db.query(`
      SELECT ms.id, ms.price, ms.status,
             s.id as seat_id, s.seat_number,
             r.id as row_id, r.name as row_name,
             b.id as block_id, b.name as block_name, b.category as block_category, b.color_code as block_color, b.price as block_price
      FROM "MatchSeats" ms
      JOIN "Seats" s ON s.id = ms.seat_id
      JOIN "Rows" r ON r.id = s.row_id
      JOIN "Blocks" b ON b.id = r.block_id
      WHERE ms.match_id = $1
    `, [id]);

    const data = rows.map(r => ({
      id: r.id, price: r.price, status: r.status,
      seat: {
        id: r.seat_id, seat_number: r.seat_number,
        row: {
          id: r.row_id, name: r.row_name,
          block: { id: r.block_id, name: r.block_name, category: r.block_category, color_code: r.block_color, price: r.block_price }
        }
      }
    }));
    res.status(200).json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

const lockSeatSchema = z.object({ seatId: z.string().uuid() });

exports.lockSeat = async (req, res, next) => {
  try {
    const { id: matchId } = req.params;
    const { seatId } = lockSeatSchema.parse(req.body);
    const userId = req.user.id;

    const { rows } = await db.query('SELECT status FROM "MatchSeats" WHERE match_id = $1 AND id = $2', [matchId, seatId]);
    if (rows.length === 0) throw new AppError('Seat not found for this match', 404);
    if (rows[0].status === 'BOOKED') throw new AppError('Seat is already booked', 400);

    const isLocked = await LockService.lockSeat(matchId, seatId, userId);
    if (!isLocked) {
      const currentOwner = await LockService.getLockOwner(matchId, seatId);
      if (currentOwner === userId) {
        await LockService.extendLock(matchId, seatId, userId);
      } else {
        throw new AppError('Seat is currently locked by another user', 409);
      }
    }

    const io = req.app.get('io');
    if (io) {
      io.to(`match_${matchId}`).emit('seat_locked', { matchId, seatId, lockedBy: userId });
    }

    res.status(200).json({ status: 'success', message: 'Seat locked successfully' });
  } catch (err) {
    next(err);
  }
};

exports.joinQueue = async (req, res, next) => {
  try {
    const { id: matchId } = req.params;
    const userId = req.user.id;
    await QueueService.joinQueue(matchId, userId);
    const position = await QueueService.getUserPosition(matchId, userId);
    res.status(200).json({ status: 'success', data: { position } });
  } catch (err) {
    next(err);
  }
};

exports.leaveQueue = async (req, res, next) => {
  try {
    const { id: matchId } = req.params;
    const userId = req.user.id;
    await QueueService.leaveQueue(matchId, userId);
    res.status(200).json({ status: 'success', message: 'Left queue' });
  } catch (err) {
    next(err);
  }
};

exports.getQueueStatus = async (req, res, next) => {
  try {
    const { id: matchId } = req.params;
    const userId = req.user.id;
    const position = await QueueService.getUserPosition(matchId, userId);
    const totalSize = await QueueService.getQueueSize(matchId);
    res.status(200).json({ status: 'success', data: { inQueue: position !== null, position, totalSize } });
  } catch (err) {
    next(err);
  }
};
