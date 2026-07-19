const Redis = require('ioredis');
const env = require('./env');

const redis = new Redis(env.redis.url);

redis.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

module.exports = redis;
