"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveOrder = saveOrder;
exports.saveEvent = saveEvent;
exports.closePool = closePool;
const pg_1 = require("pg");
// Use your local postgres credentials
const connectionString = process.env.DATABASE_URL ||
    'postgresql://postgres:Suryansh@localhost:5432/orders';
const pool = new pg_1.Pool({ connectionString });
async function saveOrder(orderId, order, status, txId) {
    const client = await pool.connect();
    try {
        await client.query(`
      INSERT INTO orders(id, client_id, side, base_asset, quote_asset, amount, status, tx_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (id)
      DO UPDATE SET
        status = EXCLUDED.status,
        tx_id = EXCLUDED.tx_id,
        updated_at = NOW()
      `, [
            orderId,
            order.clientId,
            order.side,
            order.baseAsset,
            order.quoteAsset,
            order.amount,
            status,
            txId || null,
        ]);
    }
    finally {
        client.release();
    }
}
async function saveEvent(orderId, event, payload) {
    const client = await pool.connect();
    try {
        await client.query(`
      INSERT INTO order_events(order_id, event, payload)
      VALUES ($1, $2, $3::jsonb)
      `, [orderId, event, JSON.stringify(payload)]);
    }
    finally {
        client.release();
    }
}
async function closePool() {
    await pool.end();
}
