import { useMemo } from "react";
import { useTable } from "react-table";

const PortfolioTable = ({ stockData }) => {
  // console.log("Rendering PortfolioTable with stockData:", stockData);
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
      { Header: "Investment", accessor: "investment" },
      {
        Header: "Portfolio %",
        accessor: (row) =>
          totalInvestment > 0
            ? ((row.investment / totalInvestment) * 100).toFixed(2) + "%"
            : "0%",
      },
      { Header: "Exchange", accessor: "exchange" },
      {
        Header: "Present Value",
        accessor: (row) => row.presentValue.toFixed(2),
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
        },
      },
    ], [totalInvestment]);
  
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
      columns,
      data: stockData,
    });
  
    return (
      <div className="p-6 bg-gray-900 text-white shadow-md">
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
  