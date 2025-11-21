"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// a basic unit test for router logic
const router_1 = require("../router/router");
test('pick best quote chooses minimum effective price', () => {
    const quotes = [
        { venue: 'a', price: 10, slippage: 0.01, liquidityScore: 50, latencyMs: 200 },
        { venue: 'b', price: 9.9, slippage: 0.03, liquidityScore: 10, latencyMs: 100 },
    ];
    const chosen = (0, router_1.pickBestQuote)(quotes);
    expect(chosen.venue).toBe('a'); // effective a = 10.1, b = 10.197 -> a chosen
});
