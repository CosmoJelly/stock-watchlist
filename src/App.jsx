import { useEffect, useState } from "react";
import socket from "./services/websocket";
import SearchBar from "./components/SearchBar";

import {
  getQuote,
  getMarketStatus,
} from "./services/api";

const DEFAULT_WATCHLIST = [
  {
    symbol: "BINANCE:BTCUSDT",
    description: "Bitcoin",
  },
];

export default function App() {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");

    let parsed = saved
      ? JSON.parse(saved)
      : [];

    const hasBTC = parsed.find(
      (x) =>
        x.symbol === "BINANCE:BTCUSDT"
    );

    if (!hasBTC) {
      parsed = [
        ...DEFAULT_WATCHLIST,
        ...parsed,
      ];
    }

    return parsed;
  });

  const [prices, setPrices] = useState({});
  const [base24h, setBase24h] =
    useState({});

  const [marketStatus, setMarketStatus] =
    useState("loading");

  // persist watchlist
  useEffect(() => {
    localStorage.setItem(
      "watchlist",
      JSON.stringify(watchlist)
    );
  }, [watchlist]);

  // market status
  useEffect(() => {
    async function loadStatus() {
      try {
        const data =
          await getMarketStatus();

        setMarketStatus(
          data.isOpen
            ? "open"
            : "closed"
        );
      } catch {
        setMarketStatus("unknown");
      }
    }

    loadStatus();

    const interval = setInterval(
      loadStatus,
      60000
    );

    return () =>
      clearInterval(interval);
  }, []);

  // add stock
  async function addStock(stock) {
    const exists = watchlist.find(
      (x) =>
        x.symbol === stock.symbol
    );

    if (exists) return;

    socket.send(
      JSON.stringify({
        type: "subscribe",
        symbol: stock.symbol,
      })
    );

    try {
      const quote = await getQuote(
        stock.symbol
      );

      setPrices((prev) => ({
        ...prev,
        [stock.symbol]: quote.c,
      }));

      setBase24h((prev) => ({
        ...prev,
        [stock.symbol]:
          quote.pc ?? quote.c,
      }));
    } catch (err) {
      console.error(err);
    }

    setWatchlist((prev) => [
      ...prev,
      stock,
    ]);
  }

  // remove stock
  function removeStock(symbol) {
    setWatchlist((prev) =>
      prev.filter(
        (x) => x.symbol !== symbol
      )
    );
  }

  // websocket
  useEffect(() => {
    socket.onopen = () => {
      console.log(
        "✅ WebSocket Connected"
      );

      socket.send(
        JSON.stringify({
          type: "subscribe",
          symbol:
            "BINANCE:BTCUSDT",
        })
      );
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(
        event.data
      );

      if (message.type !== "trade")
        return;

      message.data.forEach((trade) => {
        setPrices((prev) => ({
          ...prev,
          [trade.s]: trade.p,
        }));
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl text-green-400 font-bold">
          mktwatch_
        </h1>

        {/* MARKET STATUS */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">
            Market:
          </span>

          <span
            className={
              marketStatus === "open"
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {marketStatus.toUpperCase()}
          </span>

          <span
            className={
              marketStatus === "open"
                ? "w-2 h-2 bg-green-400 rounded-full animate-pulse"
                : "w-2 h-2 bg-red-400 rounded-full"
            }
          />
        </div>
      </div>

      <SearchBar onAdd={addStock} />

      {/* WATCHLIST */}
      <div className="mt-8">
        {watchlist.map((stock) => {
          const price =
            prices[stock.symbol];

          const base =
            base24h[stock.symbol];

          const change =
            price && base
              ? (
                  ((price - base) /
                    base) *
                  100
                ).toFixed(2)
              : null;

          const isUp =
            Number(change) >= 0;

          return (
            <div
              key={stock.symbol}
              className="
                border
                border-zinc-800
                p-4
                mb-3
                flex
                justify-between
              "
            >
              <div>
                <h2 className="text-green-400 text-xl">
                  {stock.symbol}
                </h2>

                <p className="text-zinc-400">
                  {
                    stock.description
                  }
                </p>

                <div className="flex gap-3 items-center mt-2">
	<p className="text-2xl text-green-400">
	  {price ? (
	    `$${Number(price).toFixed(2)}`
	  ) : marketStatus === "closed" &&
	    !stock.symbol.includes("BINANCE:") ? (
	    <span className="text-red-400 text-lg">
	      MARKET CLOSED
	    </span>
	  ) : (
	    "Loading..."
	  )}
	</p>
                  {change && (
                    <span
                      className={
                        isUp
                          ? "text-green-400 text-sm"
                          : "text-red-400 text-sm"
                      }
                    >
                      {isUp
                        ? "+"
                        : ""}
                      {change}% (24h)
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() =>
                  removeStock(
                    stock.symbol
                  )
                }
                className="text-red-400 text-xl hover:text-red-300"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
