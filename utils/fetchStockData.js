import yahooFinance from "yahoo-finance2";

export const fetchStockData = async (symbol) => {
  try {
    const result = await yahooFinance.quote(symbol);
    return result;
  } catch (error) {
    console.error("Error fetching stock data:", error);
  }
};