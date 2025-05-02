import { useEffect, useState } from "react";
import PortfolioTable from "../components/PortfolioTable";
import SectorSummary from "../components/SectorSummary";


const initialStocks  = [
  { symbol: "AAPL", sector: "Technology", investment: 100000, quantity: 500 },
  { symbol: "TSLA", sector: "Automotive", investment: 80000, quantity: 200 },
  { symbol: "GOOGL", sector: "Technology", investment: 120000, quantity: 300 },
  { symbol: "MSFT", sector: "Technology", investment: 110000, quantity: 400 },
  { symbol: "AMZN", sector: "E-Commerce", investment: 95000, quantity: 150 },
  { symbol: "NFLX", sector: "Entertainment", investment: 70000, quantity: 250 },
  { symbol: "NVDA", sector: "Semiconductors", investment: 85000, quantity: 180 },
  { symbol: "JPM", sector: "Financials", investment: 65000, quantity: 220 },
  { symbol: "V", sector: "Financials", investment: 60000, quantity: 210 },
  { symbol: "KO", sector: "Consumer Goods", investment: 55000, quantity: 300 },
  { symbol: "PEP", sector: "Consumer Goods", investment: 53000, quantity: 280 },
  { symbol: "XOM", sector: "Energy", investment: 48000, quantity: 260 },
  { symbol: "META", sector: "Social Media", investment: 99000, quantity: 270 },
];


export default function Home() {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const updatedData = await Promise.all(
        initialStocks.map(async (stock) => {
          try {
            const res = await fetch(`/api/stocks?symbol=${stock.symbol}`);
            const text = await res.text();
            const data = JSON.parse(text);
            const quantity = stock.quantity || 10;
            const purchasePrice = parseFloat((stock.investment / quantity).toFixed(2));

            return {
              ...data,
              symbol: stock.symbol,
              sector: stock.sector,
              investment: stock.investment,
              quantity,
              purchasePrice,
              presentValue: parseFloat((data.regularMarketPrice * quantity).toFixed(2)),
              gainLoss: parseFloat(((data.regularMarketPrice - purchasePrice) * quantity).toFixed(2)),
            };
          } catch (error) {
            console.error(`Error fetching ${stock.symbol}:`, error);
            return null;
          }
        })
      );
      setStockData(updatedData.filter(Boolean));
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* <h1>Dynamic Portfolio Dashboard</h1> */}
      <SectorSummary stocks={stockData} />
      <PortfolioTable stockData={stockData} />
    </div>
  );  
}