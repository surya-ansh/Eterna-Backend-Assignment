import type { WebSocket } from "ws";
const { v4: uuidv4 } = require("uuid");
import { saveOrder, saveEvent } from "../DB/db";
import { redisPubSubConn } from "../jobs/redis";
import { orderQueue } from "../jobs/queue";

export async function handleOrderRequest(ws: WebSocket) {
  ws.on("message", async (raw) => {
    const data = JSON.parse(raw.toString());
    const orderId = uuidv4();

    await saveOrder(orderId, data, "pending");
    await saveEvent(orderId, "pending", {});
    ws.send(JSON.stringify({ event: "pending", orderId }));

    // subscribe to order events
    const sub = redisPubSubConn.duplicate();
    await sub.subscribe(`order-events-${orderId}`);

    sub.on("message", (_channel, msg) => {
      ws.send(msg);
    });

    // Add job to queue
    await orderQueue.add("execute", { orderId, order: data });

    ws.on("close", async () => {
      await sub.unsubscribe(`order-events-${orderId}`);
      await sub.quit();
    });
  });
}
