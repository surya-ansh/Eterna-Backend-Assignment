"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisPubSubConn = exports.redisQueueConn = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redisUrl = "redis://default:q46wDGWuSOZ51Oc4jPwKDwGZRZUsPaWU@redis-16892.crce219.us-east-1-4.ec2.cloud.redislabs.com:16892";
exports.redisQueueConn = new ioredis_1.default(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});
exports.redisPubSubConn = new ioredis_1.default(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});
