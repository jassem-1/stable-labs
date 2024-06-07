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
    <div>
    <h1>Transaction Hash: {transactionId}</h1>
    <p>Block: {transactionDetails.blockNumber}</p>
    <p>From: {transactionDetails.from}</p>
    <p>To: {transactionDetails.to}</p>
    <p>Value: {ethers.formatEther(transactionDetails.value)} ETH</p>
    <p>Gas Price: {ethers.formatUnits(transactionDetails.gasPrice, 'gwei')} Gwei</p>
  </div>
  );
};

export default TransactionPage;
