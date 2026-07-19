const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const env = require('../config/env');

const JWT_SECRET = env.jwt?.secret || 'matchday_secret_key';

// JWT-based authenticate middleware (used by our auth system)
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized: Missing or invalid token', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Unauthorized: Invalid or expired token', 401));
    }
    next(error);
  }
};

// Alias for backward compatibility
const authMiddleware = authenticate;

module.exports = authMiddleware;
module.exports.authenticate = authenticate;
