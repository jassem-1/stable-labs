// components/TokenTable.tsx
import React from 'react';

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

const TokenTable: React.FC<Props> = ({ transactions, tokenType }) => (
  <div>
    <h3>{tokenType} Transactions</h3>
    {transactions.length > 0 ? (
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
          {transactions.map((tx, index) => (
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
    ) : (
      <p>No {tokenType} transactions found.</p>
    )}
  </div>
);

export default TokenTable;
