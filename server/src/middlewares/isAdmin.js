const db = require('../db');
const AppError = require('../utils/AppError');

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const { rows } = await db.query('SELECT role FROM "Users" WHERE id = $1', [userId]);
    const user = rows[0];

    if (!user) {
      throw new AppError('User not found in public schema', 404);
    }

    if (user.role !== 'ADMIN') {
      throw new AppError('Forbidden: Admin access required', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAdmin;
