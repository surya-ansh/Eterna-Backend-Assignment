"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuotes = getQuotes;
const raydium_1 = require("./raydium");
const meteora_1 = require("./meteora");
async function getQuotes(order) {
    // parallel fetch
    const [r, m] = await Promise.all([(0, raydium_1.getRaydiumQuote)(order), (0, meteora_1.getMeteoraQuote)(order)]);
    return [r, m];
}
