const BASE_URL = "http://localhost:5000";

export async function searchStocks(query) {
  const res = await fetch(
    `${BASE_URL}/search?q=${query}`
  );

  const data = await res.json();
  return data.result || [];
}

export async function getQuote(symbol) {
  const res = await fetch(
    `${BASE_URL}/quote?symbol=${symbol}`
  );

  return await res.json();
}

export async function getMarketStatus() {
  const res = await fetch(
    `${BASE_URL}/market-status`
  );

  return await res.json();
}
