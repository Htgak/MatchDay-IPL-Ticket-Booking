const redis = require('../config/redis');
const AppError = require('../utils/AppError');

const LOCK_TTL_SECONDS = 300; // 5 minutes as requested

class LockService {
  /**
   * Generates a unique key for a match seat.
   */
  static getSeatKey(matchId, seatId) {
    return `seat_lock:${matchId}:${seatId}`;
  }

  /**
   * Attempts to lock a seat using Redis SETNX
   * @param {string} matchId
   * @param {string} seatId
   * @param {string} userId
   * @returns {boolean} true if lock acquired, false otherwise
   */
  static async lockSeat(matchId, seatId, userId) {
    const key = this.getSeatKey(matchId, seatId);
    
    // Redis SET key value NX EX TTL
    // NX = Only set the key if it does not already exist
    // EX = Set the specified expire time, in seconds
    const result = await redis.set(key, userId, 'NX', 'EX', LOCK_TTL_SECONDS);
    
    return result === 'OK';
  }

  /**
   * Releases a locked seat
   * @param {string} matchId
   * @param {string} seatId
   * @param {string} userId (to verify ownership)
   */
  static async unlockSeat(matchId, seatId, userId) {
    const key = this.getSeatKey(matchId, seatId);
    const lockedBy = await redis.get(key);

    if (lockedBy === userId) {
      await redis.del(key);
      return true;
    }
    return false;
  }

  /**
   * Extends lock if owned by the user
   */
  static async extendLock(matchId, seatId, userId) {
    const key = this.getSeatKey(matchId, seatId);
    const lockedBy = await redis.get(key);

    if (lockedBy === userId) {
      // Re-set the TTL
      await redis.expire(key, LOCK_TTL_SECONDS);
      return true;
    }
    return false;
  }

  /**
   * Gets the lock owner for a seat
   */
  static async getLockOwner(matchId, seatId) {
    const key = this.getSeatKey(matchId, seatId);
    return await redis.get(key);
  }
}

module.exports = LockService;
