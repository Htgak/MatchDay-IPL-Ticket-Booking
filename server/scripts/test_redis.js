const redis = require('./src/config/redis');

async function check() {
  console.log("Redis object:", redis);
  if (typeof redis.expire === 'function') {
    console.log("redis.expire IS a function.");
  } else {
    console.log("redis.expire IS NOT a function!");
  }
}

check();
