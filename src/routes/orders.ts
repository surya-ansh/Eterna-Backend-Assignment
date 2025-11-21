import { FastifyInstance } from "fastify";
import type { WebSocket } from "ws";
import { handleOrderRequest } from "../WSM/socketHandler";

export default async function (fastify: FastifyInstance) {

  
  fastify.post("/orders/execute", async (req, reply) => {
    return reply.code(400).send({
      error: "Use WebSocket endpoint: /api/orders/ws"
    });
  });

  
  fastify.get(
    "/orders/ws",
    { websocket: true },
    (socket: WebSocket, req) => {
      handleOrderRequest(socket);
    }
  );
}
