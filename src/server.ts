import Fastify from "fastify";
import websocket from "@fastify/websocket";
import ordersRoutes from "./routes/orders";

import { redisQueueConn } from "./jobs/redis";
import "./jobs/worker"; 

async function buildServer() {
  const server = Fastify({ logger: true });

  
  redisQueueConn.on("connect", () => {
    console.log("🔗 Redis Cloud Connected");
  });

  redisQueueConn.on("error", (err) => {
    console.error("❌ Redis Connection Error:", err);
  });

  
  await server.register(websocket);

  
  server.get("/test", async () => {
    return { ok: true };
  });

  
  server.register(ordersRoutes, { prefix: "/api" });

  return server;
}

async function start() {
  try {
    const server = await buildServer();

    await server.listen({
      port: 3000,
      host: "0.0.0.0",
    });

    console.log("🚀 Server running on http:
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
}

start();
