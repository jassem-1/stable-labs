"use client";

import { EtherscanContext } from '@/app/RootLayoutContext';
import { ethers } from 'ethers';
import Link from 'next/link';
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


  return (
    <div className="max-w-4xl mx-auto mt-10 p-5  bg-black bg-opacity-30 text-white rounded-lg  blur-background shadow-lg">
      <h1 className="text-2xl font-bold mb-5">Block Number: {blockNumber}</h1>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span>Timestamp:</span>
          <span>{new Date(blockDetails.timestamp * 1000).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
        <span>Miner:</span>
        <Link href={`/account/${blockDetails.miner}`}>
      
                      {blockDetails.miner}
                    </Link>
   
        </div>
        <div className="flex justify-between items-center">
          <span>Number of Transactions:</span>
          <span>{blockDetails.transactions.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Gas Used:</span>
          <span>{blockDetails.gasUsed.toString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Gas Limit:</span>
          <span>{blockDetails.gasLimit.toString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Base Fee Per Gas:</span>
          <span>{blockDetails.baseFeePerGas !== null ? ethers.formatUnits(blockDetails.baseFeePerGas, 'gwei') : 'N/A'} Gwei</span>
        </div>
      </div>
    </div>
  );
};

export default BlockPage;
