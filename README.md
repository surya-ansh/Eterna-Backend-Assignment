# ⚡ Eterna Backend Assignment — Real-Time Mock Order Execution Engine  
### Built by: **Suryansh Singh**  
### Repository: https://github.com/surya-ansh/Eterna-Backend-Assignment  

---

# 🧩 Overview

This project implements a **real-time order execution engine** with:

- 🚀 **Market / Limit style mock orders**
- 🔀 **DEX Router (Raydium vs Meteora — simulated quotes)**
- ⚡ **Real-time WebSocket status updates**
- 🧵 **Concurrent job processing using BullMQ**
- 💾 **Persistent storage (PostgreSQL + JSON events)**
- 🔗 **Redis Cloud for Queue + Pub/Sub**
- 🛠 **Robust retry logic, logging, fault handling**

👉 This version is a **Mock Implementation**, not Devnet execution.  
All pricing, routing, and execution are **simulated realistically** (2–5% spread, random slippage, latency, etc.)

---

# ⚙️ Architecture

```
Client (WebSocket)
        |
        | JSON order payload
        v
Fastify Server  ----> PostgreSQL (order + event history)
        |
        | publishes job
        v
Redis Queue (BullMQ)
        |
        | worker pulls jobs
        v
Worker -----> Mock DEX Router -----> Fake Raydium/Meteora Quotes
```

---

# 🔥 Features Implemented (Matches Assignment)

### ✔ **Mock DEX Router**
- Random but realistic quotes  
- Raydium vs Meteora  
- 2–5% price delta  
- Slippage + latency simulation

### ✔ **Order Lifecycle (WebSocket)**
```
pending → routing → routing:quotes → building → submitted → confirmed
```

### ✔ **Queue + Worker Logic**
- Uses **BullMQ**
- Up to **10+ concurrent jobs**
- **Automatic retry (3 attempts)**  
- Backoff built-in

### ✔ **PostgreSQL Integration**
- `orders` table (latest state)
- `order_events` table (full lifecycle audit)

### ✔ **Redis Cloud**
- Queue connection
- Pub/Sub channel:  
  `order-events-<orderId>`

### ✔ **WebSocket-First Design**
No REST order creation.  
Orders are submitted **directly via WS**, and updates stream back live.

---

# 📂 Folder Structure

```
src/
 ├── dex/                  # Mock Raydium/Meteora quote logic
 ├── jobs/                 # Redis queue + worker
 ├── ws/                   # WebSocket handler
 ├── persistence/          # PostgreSQL DB layer
 ├── routes/               # API router
 ├── server.ts             # Fastify server
dist/                      # Compiled JS
sql/                       # SQL table schema
.env
```

---

# 🛠 Setup

## 1️⃣ Clone repository

```
git clone https://github.com/surya-ansh/Eterna-Backend-Assignment
cd Eterna-Backend-Assignment
```

## 2️⃣ Install dependencies
```
npm install
```

---

# 🗄 PostgreSQL Setup

Open PostgreSQL (Windows command prompt or Ubuntu terminal):

```
psql -U postgres
```

Create DB:
```
CREATE DATABASE orders;
\c orders;
```

Create tables:

```
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  client_id TEXT,
  side TEXT,
  base_asset TEXT,
  quote_asset TEXT,
  amount NUMERIC,
  status TEXT,
  tx_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_events (
  id SERIAL PRIMARY KEY,
  order_id TEXT,
  event TEXT,
  payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

# 🔐 Environment File (.env)

The environment variables are provided in the description of the explanation video.

```
REDIS_HOST=redis-XXXXX.redislabs.com
REDIS_PORT=XXXX
REDIS_USERNAME=default
REDIS_PASSWORD=YOUR_PASSWORD

PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=YOUR_PASSWORD
PG_DB=orders

PORT=3000
HOST=0.0.0.0
```

---

# 🚀 Running the Project

### Terminal 1 — Start Server
```
npm run start
```

Expected output:
```
🚀 Server running on http://localhost:3000
🔗 Redis Cloud Connected
```

### Terminal 2 — Start Worker
```
npm run worker
```

Expected:
```
🔥 Worker started...
🔥 Worker ready and listening...
```

---

# 📡 Submitting an Order (WebSocket)

Connect via:

```
ws://localhost:3000/api/orders/ws
```

Send JSON:

```json
{
  "clientId": "user01",
  "side": "buy",
  "baseAsset": "SOL",
  "quoteAsset": "USDC",
  "amount": 10
}
```

---

# 🔁 Expected WebSocket Output

```
{ "event": "pending", "orderId": "xxxx" }
{ "event": "routing" }
{ "event": "routing:quotes", "quotes": [raydium, meteora] }
{ "event": "building", "chosen": {...} }
{ "event": "submitted", "txId": "mock-12345" }
{ "event": "confirmed", "receipt": {...} }
```

---

# 🧪 Testing (Required by Assignment)

You must include:

### ✔ 10 Unit / Integration tests  
Add at minimum:
- best route selection  
- worker retry  
- WS lifecycle  
- order DB insert  
- event DB insert  
- queue job addition  
- mock execution  
- JSON parsing  
- reconnect behavior  
- pub/sub message flow  

Test command:
```
npm test
```

---

# 📘 Postman / Insomnia Collection

Create file:

```
postman/Eterna.postman_collection.json
```

Include:
- WebSocket request  
- 3–5 simultaneous orders  
- Mock routing proof  

---

# 🎯 Conclusion

This implementation satisfies:

✔ WebSocket order lifecycle  
✔ DEX routing simulation  
✔ Worker queue system  
✔ Retry logic  
✔ Real-time status streaming  
✔ PostgreSQL storage  
✔ Redis queue + pub/sub  
✔ Clean architecture  


