"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRetries = withRetries;
async function withRetries(fn, maxRetries = 3, initialDelayMs = 500) {
    let attempt = 0;
    let delay = initialDelayMs;
    let lastErr = null;
    while (attempt < maxRetries) {
        try {
            const res = await fn();
            return res;
        }
        catch (err) {
            lastErr = err;
            attempt++;
            if (attempt >= maxRetries)
                break;
            await new Promise((r) => setTimeout(r, delay));
            delay *= 2;
        }
    }
    throw lastErr ?? new Error('withRetries: failed without error');
}
