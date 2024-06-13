"use client";
import { EtherscanContext } from '@/app/RootLayoutContext';
import { ethers } from 'ethers';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

const TransactionPage = () => {
  const [transactionId, setTransactionId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { getTransactionDetails, transactionDetails } = useContext(EtherscanContext) ?? {};

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1]; 
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
    return (
      <div className="flex justify-center items-center">
        <FaSpinner className="animate-spin text-4xl text-white" />
      </div>
    );
  }

  if (!transactionDetails) {
    return <div>No transaction details available.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 bg-black bg-opacity-30 text-white rounded-lg shadow-lg blur-background">
      <h1 className="text-xl font-bold mb-5 break-words">Transaction Hash: {transactionId}</h1>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Block:</span>
          <span>{transactionDetails.blockNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">From:</span>
          <span>
            <Link href={`/account/${transactionDetails.from.toString()}`}>
              {transactionDetails.from}
            </Link>     
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">To:</span>
          <span>
            <Link href={`/account/${transactionDetails?.to?.toString()}`}>
              {transactionDetails?.to}
            </Link>
          </span>
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
