const redis = require('../config/redis');

class QueueService {
  /**
   * Generates the Redis key for a match's waiting queue
   */
  static getQueueKey(matchId) {
    return `match_queue:${matchId}`;
  }

  /**
   * Adds a user to the waiting queue (Sorted Set sorted by timestamp)
   * @param {string} matchId 
   * @param {string} userId 
   */
  static async joinQueue(matchId, userId) {
    const key = this.getQueueKey(matchId);
    const score = Date.now();
    // ZADD adds the element or updates its score if it already exists.
    // CH means it returns the number of changed/added elements.
    await redis.zadd(key, score, userId);
  }

  /**
   * Removes a user from the queue
   */
  static async leaveQueue(matchId, userId) {
    const key = this.getQueueKey(matchId);
    await redis.zrem(key, userId);
  }

  /**
   * Gets the user's position in the queue (0-indexed, so 0 is first in line)
   * @returns {number | null} Position, or null if not in queue
   */
  static async getUserPosition(matchId, userId) {
    const key = this.getQueueKey(matchId);
    const rank = await redis.zrank(key, userId);
    return rank;
  }

  /**
   * Gets the total number of people in the queue
   */
  static async getQueueSize(matchId) {
    const key = this.getQueueKey(matchId);
    return await redis.zcard(key);
  }

  /**
   * Pops the next user from the queue (removes and returns them)
   * @returns {string | null} The userId of the next person, or null if empty
   */
  static async popNextUser(matchId) {
    const key = this.getQueueKey(matchId);
    // ZPOPMIN removes and returns the member with the lowest score (oldest timestamp)
    const result = await redis.zpopmin(key);
    // result is an array like ['userId', 'score']
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  }
}

module.exports = QueueService;
