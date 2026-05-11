# mktwatch_
### A real-time stock watchlist that actually feels alive

I wanted something like a Bloomberg / Yahoo Finance terminal, but lighter, faster, and something I could actually build in a weekend without losing my mind.

So I built a dark, minimal, real-time stock watchlist powered by WebSockets and Finnhub, with live price updates and a crypto fallback for 24/7 testing.

Built with React, Node.js, and a slightly unhealthy obsession with real-time data streams.

---
## What it does

- **Search stocks instantly** using Finnhub API
- **Live price updates** via WebSockets (real-time feed)
- **Watchlist system** — add/remove tickers instantly
- **Persistent storage** using localStorage (your list survives refresh)
- **Market status indicator** (open / closed state)
- **24h % change tracking** for each asset
- **Minimal terminal-style UI** — fast, dark, distraction-free

---
## Tech Stack

| | |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Realtime | WebSockets |
| Market Data | Finnhub API |
| Styling | Tailwind CSS |
| Storage | LocalStorage |

---
## Getting it running

### Prerequisites
- Node.js 18+
- A free Finnhub account

---
### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/stock-watchlist.git
cd stock-watchlist
```
### 2. Backend Setup

```bash
cd server
npm install
```
Create the .env file in both /server and root
```bash
FINNHUB_API_KEY=your_api_key_here
```
Start backend
```bash
node index.js
```
### 3. Frontend Setup

```bash
npm install
npm run dev
```
Open http://localhost:5173 and it should be up and running.

Make sure to start the backend first then the frontend.

---
## API Routes
### Search Stocks
```bash
GET /search?q=AAPL
```

### Get Quote
```bash
GET /quote?symbol=AAPL
```

### Market Status
```bash
GET /market-status
```

---
## Project Structure
```
stock-watchlist/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── SearchBar.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── websocket.js
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── server/
│   ├── index.js
│   └── .env
│
└── README.md
└── .env
```
---
## Future Updates

- [ ] Candlestick Charts
- [ ] Smart Ticker Suggestions
- [ ] Time Frames

---

## 🎧 Built to these playlists

> *[smell the roses](https://open.spotify.com/playlist/6OLn8jEniAqL4jynGHKl7C?si=f9d3dd452bda40b8)*

> *[it's not that pretty](https://open.spotify.com/playlist/0sohqtLYTEbG6PknfiVPna?si=c2479dc4d7e944cd)*

> *[new day, who this?](https://open.spotify.com/playlist/48RIfE2HvyNKChbupJ9ttq?si=ed719c76003e4a33)*
---

## License

Do whatever you want with it. This was just to learn and fill out stuff. Still have work to do on this.
