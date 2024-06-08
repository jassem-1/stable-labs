"use client";

import { EtherscanContext } from '@/app/RootLayoutContext';
import { ethers } from 'ethers';
import { useState, useEffect, useContext } from 'react';

const BlockPage = () => {
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { getBlockDetails, blockDetails } = useContext(EtherscanContext) ?? {};

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const number = parseInt(pathSegments[pathSegments.length - 1], 10); 
    if (!isNaN(number) && blockNumber !== number) {
      setBlockNumber(number);
      console.log("Retrieved Block Number:", number);
      if (getBlockDetails) {
        getBlockDetails(number).then(() => setLoading(false));
      }
    } else {
      console.log("No Block Number found");
      setLoading(false);
    }
  }, [getBlockDetails]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!blockDetails) {
    return <div>No block details available.</div>;
  }

  const baseFeePerGas = blockDetails.baseFeePerGas || 0; 

  return (
    <div>
      <h1>Block Number: {blockNumber}</h1>
      <p>Timestamp: {new Date(blockDetails.timestamp * 1000).toLocaleString()}</p>
      <p>Miner: {blockDetails.miner}</p>
      <p>Number of Transactions: {blockDetails.transactions.length}</p>
      <p>Gas Used: {blockDetails.gasUsed.toString()}</p>
      <p>Gas Limit: {blockDetails.gasLimit.toString()}</p>
      <p>Base Fee Per Gas: {ethers.formatUnits(baseFeePerGas, 'gwei')} Gwei</p>
    </div>
  );
};

export default BlockPage;
