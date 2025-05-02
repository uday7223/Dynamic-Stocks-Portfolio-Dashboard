const SectorSummary = ({ stocks }) => {
    const sectors = stocks.reduce((acc, stock) => {
      const { sector, investment, presentValue, quantity } = stock;
  
      // Ensure investment and presentValue have valid numbers
      const validInvestment = investment || 0;
      const validPresentValue = presentValue || 0;
  
      acc[sector] = acc[sector] || { totalInvestment: 0, totalValue: 0 };
      acc[sector].totalInvestment += validInvestment;
      acc[sector].totalValue += validPresentValue * quantity; // Assuming presentValue is the current price per share
  
      return acc;
    }, {});
  
  
    return (
        <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Sector-wise Portfolio Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(sectors).map(([sector, summary]) => (
            <div key={sector} className="p-4 bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-200">{sector}</h3>
              <p className="mt-2 text-gray-300">💰 Investment: <span className="text-green-400">${summary.totalInvestment.toFixed(2)}</span></p>
              <p className="mt-1 text-gray-300">📈 Present Value: <span className="text-blue-400">${summary.totalValue.toFixed(2)}</span></p>
            </div>
          ))}
        </div>
      </div>
  
    );
  };
  
  export default SectorSummary;