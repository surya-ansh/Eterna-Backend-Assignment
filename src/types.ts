export type Side = 'buy' | 'sell';

export interface OrderRequest {
  clientId: string;
  side: Side;
  baseAsset: string;
  quoteAsset: string;
  amount: number; 
}

export interface Quote {
  venue: string;
  price: number; 
  slippage: number; 
  liquidityScore: number; 
  latencyMs?: number;
}

export interface ExecutionResult {
  success: boolean;
  txId?: string;
  error?: string;
  confirmations?: number;
}
