import { Pool } from 'pg';
import { OrderRequest } from '../types';


const connectionString =
  process.env.DATABASE_URL ||
  'postgresql:

const pool = new Pool({ connectionString });

export async function saveOrder(
  orderId: string,
  order: OrderRequest,
  status: string,
  txId?: string
) {
  const client = await pool.connect();
  try {
    await client.query(
      `
      INSERT INTO orders(id, client_id, side, base_asset, quote_asset, amount, status, tx_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (id)
      DO UPDATE SET
        status = EXCLUDED.status,
        tx_id = EXCLUDED.tx_id,
        updated_at = NOW()
      `,
      [
        orderId,
        order.clientId,
        order.side,
        order.baseAsset,
        order.quoteAsset,
        order.amount,
        status,
        txId || null,
      ]
    );
  } finally {
    client.release();
  }
}

export async function saveEvent(orderId: string, event: string, payload: any) {
  const client = await pool.connect();
  try {
    await client.query(
      `
      INSERT INTO order_events(order_id, event, payload)
      VALUES ($1, $2, $3::jsonb)
      `,
      [orderId, event, JSON.stringify(payload)]
    );
  } finally {
    client.release();
  }
}

export async function closePool() {
  await pool.end();
}
