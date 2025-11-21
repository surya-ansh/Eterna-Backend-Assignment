"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("./redis");
const quotes_1 = require("../dex/quotes");
const router_1 = require("../router/router");
const executeOrder_1 = require("../executor/executeOrder");
const retry_1 = require("../utils/retry");
const db_1 = require("../persistence/db");
function publish(orderId, message) {
    redis_1.redisPubSubConn.publish(`order-events-${orderId}`, JSON.stringify(message));
}
console.log("🔥 Worker is starting...");
exports.orderWorker = new bullmq_1.Worker("order-queue", async (job) => {
    console.log("⚙️ Worker processing job:", job.id);
    const { orderId, order } = job.data;
    publish(orderId, { event: "routing" });
    await (0, db_1.saveEvent)(orderId, "routing", {});
    const quotes = await (0, quotes_1.getQuotes)(order);
    publish(orderId, { event: "routing:quotes", quotes });
    await (0, db_1.saveEvent)(orderId, "routing:quotes", { quotes });
    const chosen = (0, router_1.pickBestQuote)(quotes);
    publish(orderId, { event: "building", chosen });
    await (0, db_1.saveEvent)(orderId, "building", { chosen });
    const execFn = async () => {
        const res = await (0, executeOrder_1.executeOnVenue)(order, chosen);
        if (!res.success)
            throw new Error(res.error ?? "execution failed");
        return res;
    };
    const result = await (0, retry_1.withRetries)(execFn, 3, 500);
    publish(orderId, { event: "submitted", txId: result.txId });
    await (0, db_1.saveEvent)(orderId, "submitted", { result });
    publish(orderId, { event: "confirmed", receipt: result });
    await (0, db_1.saveOrder)(orderId, order, "confirmed", result.txId);
    console.log("✔️ Worker job completed:", job.id);
    return result;
}, { connection: redis_1.redisQueueConn });
exports.orderWorker.on("failed", (job, err) => {
    console.error("❌ Worker failed:", job?.id, err);
});
exports.orderWorker.on("ready", () => {
    console.log("🔥 Worker is ready and listening for jobs...");
});
exports.orderWorker.on("completed", (job) => {
    console.log("✔️ Job completed:", job.id);
});
