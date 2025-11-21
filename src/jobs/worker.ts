import { Worker } from "bullmq";
import { redisQueueConn, redisPubSubConn } from "./redis";
import { getQuotes } from "../dex/quotes";
import { pickBestQuote } from "../router/router";
import { executeOnVenue } from "../executor/executeOrder";
import { withRetries } from "../utils/retry";
import { saveEvent, saveOrder } from "../DB/db";

function publish(orderId: string, message: any) {
  redisPubSubConn.publish(`order-events-${orderId}`, JSON.stringify(message));
}

console.log("Worker is working properly...");

export const orderWorker = new Worker(
  "order-queue",
  async (job) => {
    console.log("Worker processing job:", job.id);

    const { orderId, order } = job.data;

    publish(orderId, { event: "routing" });
    await saveEvent(orderId, "routing", {});

    const quotes = await getQuotes(order);
    publish(orderId, { event: "routing:quotes", quotes });
    await saveEvent(orderId, "routing:quotes", { quotes });

    const chosen = pickBestQuote(quotes);
    publish(orderId, { event: "building", chosen });
    await saveEvent(orderId, "building", { chosen });

    const execFn = async () => {
      const res = await executeOnVenue(order, chosen);
      if (!res.success) throw new Error(res.error ?? "execution failed");
      return res;
    };

    const result = await withRetries(execFn, 3, 500);

    publish(orderId, { event: "submitted", txId: result.txId });
    await saveEvent(orderId, "submitted", { result });

    publish(orderId, { event: "confirmed", receipt: result });
    await saveOrder(orderId, order, "confirmed", result.txId);

    console.log("Worker job completed:", job.id);
    return result;
  },
  { connection: redisQueueConn }
);

orderWorker.on("failed", (job, err) => {
  console.error("Worker failed:", job?.id, err);
});

orderWorker.on("ready", () => {
  console.log("Worker is ready and listening for jobs...");
});

orderWorker.on("completed", (job) => {
  console.log("Job completed:", job.id);
});
