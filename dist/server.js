"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const orders_1 = __importDefault(require("./routes/orders"));
const redis_1 = require("./jobs/redis");
require("./jobs/worker"); // start worker automatically
async function buildServer() {
    const server = (0, fastify_1.default)({ logger: true });
    // Redis Connection Logs
    redis_1.redisQueueConn.on("connect", () => {
        console.log("🔗 Redis Cloud Connected");
    });
    redis_1.redisQueueConn.on("error", (err) => {
        console.error("❌ Redis Connection Error:", err);
    });
    // WebSocket plugin
    await server.register(websocket_1.default);
    // Test endpoint
    server.get("/test", async () => {
        return { ok: true };
    });
    // Main API routes
    server.register(orders_1.default, { prefix: "/api" });
    return server;
}
async function start() {
    try {
        const server = await buildServer();
        await server.listen({
            port: 3000,
            host: "0.0.0.0",
        });
        console.log("🚀 Server running on http://localhost:3000");
    }
    catch (err) {
        console.error("❌ Server failed to start:", err);
        process.exit(1);
    }
}
start();
