"use client";

import { EtherscanContext } from '@/app/RootLayoutContext';
import { ethers } from 'ethers';
import { useState, useEffect, useContext } from 'react';

const TransactionPage = () => {
  const [transactionId, setTransactionId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { getTransactionDetails, transactionDetails } = useContext(EtherscanContext) ?? {};

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1]; // Get the last segment
    if (id && transactionId !== id) {
      setTransactionId(id);
      console.log("Retrieved Transaction ID:", id);
      if (getTransactionDetails) {
        getTransactionDetails(id).then(() => setLoading(false));
      }
    } else {
      console.log("No Transaction ID found");
      setLoading(false);
    }
  }, [getTransactionDetails]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!transactionDetails) {
    return <div>No transaction details available.</div>;
  }


  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 bg-gray-900 text-white rounded-lg shadow-lg">
    <h1 className="text-3xl font-bold mb-5">Transaction Hash: {transactionId}</h1>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="font-semibold">Block:</span>
        <span>{transactionDetails.blockNumber}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold">From:</span>
        <span>{transactionDetails.from}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold">To:</span>
        <span>{transactionDetails.to}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold">Value:</span>
        <span>{ethers.formatEther(transactionDetails.value)} ETH</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold">Gas Price:</span>
        <span>{ethers.formatUnits(transactionDetails.gasPrice, 'gwei')} Gwei</span>
      </div>
    </div>
  </div>
  );
};

export default TransactionPage;
