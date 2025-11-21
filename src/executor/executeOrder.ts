import { OrderRequest, Quote, ExecutionResult } from '../types';

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function executeOnVenue(order: OrderRequest, quote: Quote): Promise<ExecutionResult> {
  
  await sleep(800 + Math.floor(Math.random() * 2000));

  
  const failChance = 0.12;
  if (Math.random() < failChance) {
    return { success: false, error: 'venue execution error (simulated)' };
  }

  
  const simulatedTxId = `${quote.venue}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  return { success: true, txId: simulatedTxId, confirmations: 1 };
}
