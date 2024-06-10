import React, { useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

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

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div>
      {currentTransactions.length > 0 ? (
        <>
          <table className="min-w-2/3 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  Transaction Hash
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  Block
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  Age
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  From
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  To
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  Value
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  Token
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTransactions.map((tx, index) => (
                <tr key={index}>
                  <td
                    className="px-2 py-4 whitespace-nowrap overflow-hidden text-sm overflow-ellipsis"
                    data-tooltip-id={`tooltip-hash-${index}`}
                    data-tooltip-content={tx.hash}
                    style={{ maxWidth: "14ch" }}
                  >
                    {truncateText(tx.hash, 14)}
                  </td>
                  <td
                    className="px-2 py-4 whitespace-nowrap overflow-hidden text-sm overflow-ellipsis"
                    data-tooltip-id={`tooltip-block-${index}`}
                    data-tooltip-content={tx.blockNumber}
                    style={{ maxWidth: "14ch" }}
                  >
                    {tx.blockNumber}
                  </td>
                  <td
                    className="px-2 py-4 whitespace-nowrap overflow-hidden text-sm overflow-ellipsis"
                    data-tooltip-id={`tooltip-age-${index}`}
                    data-tooltip-content={new Date(
                      parseInt(tx.timeStamp) * 1000
                    ).toLocaleString()}
                    style={{ maxWidth: "14ch" }}
                  >
                    {new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()}
                  </td>
                  <td
                    className="px-2 py-4 whitespace-nowrap overflow-hidden text-sm overflow-ellipsis"
                    data-tooltip-id={`tooltip-from-${index}`}
                    data-tooltip-content={tx.from}
                    style={{ maxWidth: "14ch" }}
                  >
                    {truncateText(tx.from, 14)}
                  </td>
                  <td
                    className="px-2 py-4 whitespace-nowrap overflow-hidden text-sm overflow-ellipsis"
                    data-tooltip-id={`tooltip-to-${index}`}
                    data-tooltip-content={tx.to}
                    style={{ maxWidth: "14ch" }}
                  >
                    {truncateText(tx.to, 14)}
                  </td>
                  <td
                    className="px-2 py-4 whitespace-nowrap overflow-hidden text-sm  overflow-ellipsis"
                    data-tooltip-id={`tooltip-value-${index}`}
                    data-tooltip-content={tx.value}
                    style={{ maxWidth: "14ch" }}
                  >
                    {tx.value}
                  </td>
                  <td
                    className="px-2 py-4 whitespace-nowrap overflow-hidden text-sm overflow-ellipsis"
                    data-tooltip-id={`tooltip-token-${index}`}
                    data-tooltip-content={`${tx.tokenName} (${tx.tokenSymbol})`}
                    style={{ maxWidth: "14ch" }}
                  >
                    {truncateText(`${tx.tokenName} (${tx.tokenSymbol})`, 14)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentTransactions.map((tx, index) => (
            <ReactTooltip
              id={`tooltip-hash-${index}`}
              className="custom-tooltip"
              key={`tooltip-hash-${index}`}
            />
          ))}

          {currentTransactions.map((tx, index) => (
            <ReactTooltip
              id={`tooltip-block-${index}`}
              className="custom-tooltip"
              key={`tooltip-block-${index}`}
            />
          ))}

          {currentTransactions.map((tx, index) => (
            <ReactTooltip
              id={`tooltip-age-${index}`}
              className="custom-tooltip"
              key={`tooltip-age-${index}`}
            />
          ))}

          {currentTransactions.map((tx, index) => (
            <ReactTooltip
              id={`tooltip-from-${index}`}
              className="custom-tooltip"
              key={`tooltip-from-${index}`}
            />
          ))}

          {currentTransactions.map((tx, index) => (
            <ReactTooltip
              id={`tooltip-to-${index}`}
              className="custom-tooltip"
              key={`tooltip-to-${index}`}
            />
          ))}

          {currentTransactions.map((tx, index) => (
            <ReactTooltip
              id={`tooltip-value-${index}`}
              className="custom-tooltip"
              key={`tooltip-value-${index}`}
            />
          ))}

          {currentTransactions.map((tx, index) => (
            <ReactTooltip
              id={`tooltip-token-${index}`}
              className="custom-tooltip"
              key={`tooltip-token-${index}`}
            />
          ))}

          <div className="flex justify-between mt-4 w-1/3">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of{" "}
              {Math.ceil(transactions.length / rowsPerPage)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={
                currentPage === Math.ceil(transactions.length / rowsPerPage)
              }
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No {tokenType} transactions found.</p>
      )}
    </div>
  );
};

export default TokenTable;
