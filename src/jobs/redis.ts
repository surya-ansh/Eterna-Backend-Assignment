import IORedis from "ioredis";

const redisUrl =
  "redis://default:q46wDGWuSOZ51Oc4jPwKDwGZRZUsPaWU@redis-16892.crce219.us-east-1-4.ec2.cloud.redislabs.com:16892";

export const redisQueueConn = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const redisPubSubConn = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});
