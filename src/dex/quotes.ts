import { OrderRequest, Quote } from '../types';
import { getRaydiumQuote } from './raydium';
import { getMeteoraQuote } from './meteora';

export async function getQuotes(order: OrderRequest): Promise<Quote[]> {
  
  const [r, m] = await Promise.all([getRaydiumQuote(order), getMeteoraQuote(order)]);
  return [r, m];
}
