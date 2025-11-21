"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeOnVenue = executeOnVenue;
function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
}
/**
 * Mock execution: 1-3s delay, ~85-95% success probability.
 * Returns txId on success.
 */
async function executeOnVenue(order, quote) {
    // simulate build time
    await sleep(800 + Math.floor(Math.random() * 2000));
    // fail sometimes (10-15%)
    const failChance = 0.12;
    if (Math.random() < failChance) {
        return { success: false, error: 'venue execution error (simulated)' };
    }
    // success
    const simulatedTxId = `${quote.venue}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    return { success: true, txId: simulatedTxId, confirmations: 1 };
}
