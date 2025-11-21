import { OrderRequest, Quote } from '../types';

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function getRaydiumQuote(order: OrderRequest): Promise<Quote> {
  const start = Date.now();
  
  const latency = 300 + Math.floor(Math.random() * 700);
  await sleep(latency);

  
  const basePrice = 20; 
  const priceJitter = 1 + (Math.random() - 0.5) * 0.02; 
  const price = +(basePrice * priceJitter).toFixed(6);
  const slippage = +(0.001 + Math.random() * 0.002).toFixed(6); 
  const liquidityScore = Math.floor(50 + Math.random() * 50);

  return {
    venue: 'raydium',
    price,
    slippage,
    liquidityScore,
    latencyMs: Date.now() - start,
  };
}
