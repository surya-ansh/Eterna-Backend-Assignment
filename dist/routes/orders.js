"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const socketHandler_1 = require("../ws/socketHandler");
async function default_1(fastify) {
    // We don't use POST → upgrade, so we direct user to WS
    fastify.post("/orders/execute", async (req, reply) => {
        return reply.code(400).send({
            error: "Use WebSocket endpoint: /api/orders/ws"
        });
    });
    // WebSocket endpoint
    fastify.get("/orders/ws", { websocket: true }, (socket, req) => {
        (0, socketHandler_1.handleOrderRequest)(socket);
    });
}
