import { useState } from "react";
import { searchStocks } from "../services/api";

export default function SearchBar({ onAdd }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  async function handleSearch(e) {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      const data = await searchStocks(value);
      setResults((data || []).slice(0, 5));
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    }
  }

  return (
    <div className="mt-6">
      <input
        value={query}
        onChange={handleSearch}
        placeholder="Search ticker..."
        className="
          w-full p-3 bg-black border border-zinc-700
          text-green-400 outline-none focus:border-green-400
        "
      />

      <div className="mt-2 border border-zinc-800">
        {results.map((stock) => (
          <button
            key={stock.symbol}
            onClick={() => {
              onAdd(stock);
              setQuery("");
              setResults([]);
            }}
            className="
              w-full text-left p-3
              hover:bg-zinc-900 border-b border-zinc-800
            "
          >
            <span className="text-green-400">
              {stock.symbol}
            </span>

            <span className="ml-2 text-zinc-400">
              {stock.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
