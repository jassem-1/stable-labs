import React, { useState } from 'react';

type TokenTransaction = {
  hash: string;
  blockNumber: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
};

type Props = {
  transactions: TokenTransaction[];
  tokenType: string;
};

const TokenTable: React.FC<Props> = ({ transactions, tokenType }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const handleNextPage = () => {
    if (currentPage < Math.ceil(transactions.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  return (
    <div>
      <h3>{tokenType} Transactions</h3>
      {currentTransactions.length > 0 ? (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Hash</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTransactions.map((tx, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.hash}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.blockNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.from}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.to}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.tokenName} ({tx.tokenSymbol})</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button onClick={handlePreviousPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded">Previous</button>
            <span>Page {currentPage} of {Math.ceil(transactions.length / rowsPerPage)}</span>
            <button onClick={handleNextPage} disabled={currentPage === Math.ceil(transactions.length / rowsPerPage)} className="px-4 py-2 bg-gray-200 rounded">Next</button>
          </div>
        </>
      ) : (
        <p>No {tokenType} transactions found.</p>
      )}
    </div>
  );
};

export default TokenTable;
