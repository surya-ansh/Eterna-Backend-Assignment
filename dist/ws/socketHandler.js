"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOrderRequest = handleOrderRequest;
const { v4: uuidv4 } = require("uuid");
const db_1 = require("../persistence/db");
const redis_1 = require("../jobs/redis");
const queue_1 = require("../jobs/queue");
async function handleOrderRequest(ws) {
    ws.on("message", async (raw) => {
        const data = JSON.parse(raw.toString());
        const orderId = uuidv4();
        await (0, db_1.saveOrder)(orderId, data, "pending");
        await (0, db_1.saveEvent)(orderId, "pending", {});
        ws.send(JSON.stringify({ event: "pending", orderId }));
        // subscribe to order events
        const sub = redis_1.redisPubSubConn.duplicate();
        await sub.subscribe(`order-events-${orderId}`);
        sub.on("message", (_channel, msg) => {
            ws.send(msg);
        });
        // Add job to queue
        await queue_1.orderQueue.add("execute", { orderId, order: data });
        ws.on("close", async () => {
            await sub.unsubscribe(`order-events-${orderId}`);
            await sub.quit();
        });
    });
}
