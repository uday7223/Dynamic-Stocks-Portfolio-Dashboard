import { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";

const PortfolioTable = ({ stocks }) => {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        const updatedData = await Promise.all(
          stocks.map(async (stock) => {
            try {
              const res = await fetch(`/api/stocks?symbol=${stock.symbol}`);
              if (!res.ok) throw new Error(`API failed for ${stock.symbol}`);
              
              const text = await res.text();
              if (!text) throw new Error(`Empty response for ${stock.symbol}`);
      
              const data = JSON.parse(text); 
                if (!data || !data.regularMarketPrice) throw new Error(`Invalid data for ${stock.symbol}`);      
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
  }, [stocks]);

  const totalInvestment = useMemo(() => {
    return stockData.reduce((sum, s) => sum + s.investment, 0);
  }, [stockData]);

  const columns = useMemo(() => [
    { Header: "Stock Name", accessor: "longName" },
    { Header: "CMP", accessor: "regularMarketPrice" },
    { Header: "P/E Ratio", accessor: "trailingPE" },
    { Header: "Latest Earnings", accessor: "epsTrailingTwelveMonths" },
    { Header: "Purchase Price", accessor: "purchasePrice" },
    { Header: "Quantity", accessor: "quantity" },
    {
      Header: "Investment",
      accessor: "investment"
    },
    {
      Header: "Portfolio %",
      accessor: (row) =>
        totalInvestment > 0
          ? ((row.investment / totalInvestment) * 100).toFixed(2) + "%"
          : "0%"
    },
    {
      Header: "Exchange",
      accessor: "exchange"
    },
    {
      Header: "Present Value",
      accessor: (row) => row.presentValue.toFixed(2)
    },
    {
        Header: "Gain/Loss",
        accessor: "gainLoss",
        Cell: ({ value }) => {
          const isGain = value >= 0;
          return (
            <span className={isGain ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
              {isGain ? "▲ " : "▼ "}
              {value.toFixed(2)}
            </span>
          );
        }
      }
  ], [totalInvestment]);

  // Update presentValue in original stocks array for SectorSummary
  useEffect(() => {
    stockData.forEach((s, i) => {
      stocks[i].presentValue = s.presentValue;
    });
  }, [stockData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: stockData });

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Stock Portfolio</h2>
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="w-full border-collapse">
          <thead className="bg-gray-800 text-gray-200">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} key={column.id} className="px-4 py-2 text-left">
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="divide-y divide-gray-700">
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id} className="hover:bg-gray-800 transition">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} key={cell.column.id} className="px-4 py-2">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioTable;
