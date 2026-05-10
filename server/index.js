import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

import WebSocket, {
  WebSocketServer,
} from "ws";

dotenv.config();

const app = express();

app.use(cors());

const API_KEY =
  process.env.FINNHUB_API_KEY;

// -----------------------------
// HEALTH ROUTE
// -----------------------------
app.get("/", (_, res) => {
  res.send("Backend running");
});

// -----------------------------
// START EXPRESS SERVER
// -----------------------------
const server = app.listen(
  5000,
  () => {
    console.log(
      "Server running on 5000"
    );
  }
);

// -----------------------------
// FRONTEND WEBSOCKET SERVER
// -----------------------------
const wss = new WebSocketServer({
  server,
});

// -----------------------------
// FINNHUB REALTIME SOCKET
// -----------------------------
const finnhubSocket =
  new WebSocket(
    `wss://ws.finnhub.io?token=${API_KEY}`
  );

finnhubSocket.on("open", () => {
  console.log(
    "Connected to Finnhub realtime"
  );

  // ALWAYS subscribe BTC
  finnhubSocket.send(
    JSON.stringify({
      type: "subscribe",
      symbol: "BINANCE:BTCUSDT",
    })
  );
});

// -----------------------------
// RELAY REALTIME DATA
// -----------------------------
finnhubSocket.on(
  "message",
  (data) => {
    // forward directly to frontend
    wss.clients.forEach((client) => {
      if (
        client.readyState ===
        WebSocket.OPEN
      ) {
        client.send(data.toString());
      }
    });
  }
);
// -----------------------------
// MARKET AVALIABILITY
// -----------------------------
app.get("/market-status", async (_, res) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${API_KEY}`
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// -----------------------------
// SEARCH STOCK
// -----------------------------
app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.json({ result: [] });
    }

    const response = await axios.get(
      `https://finnhub.io/api/v1/search?q=${query}&token=${API_KEY}`
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// -----------------------------
// FRONTEND CLIENTS
// -----------------------------
wss.on("connection", (ws) => {
  console.log(
    "Frontend connected"
  );

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      // relay subscriptions to Finnhub
      if (
        data.type === "subscribe"
      ) {
        finnhubSocket.send(
          JSON.stringify({
            type: "subscribe",
            symbol: data.symbol,
          })
        );

        console.log(
          "Subscribed:",
          data.symbol
        );
      }

      if (
        data.type === "unsubscribe"
      ) {
        finnhubSocket.send(
          JSON.stringify({
            type: "unsubscribe",
            symbol: data.symbol,
          })
        );
      }
    } catch (err) {
      console.error(
        "WS message error:",
        err
      );
    }
  });
});
