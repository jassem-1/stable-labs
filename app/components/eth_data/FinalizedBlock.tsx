"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

const FetchFinalizedBlock = () => {
  const [finalizedBlockNumber, setFinalizedBlockNumber] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchLastFinalizedBlock = () => {
    const apiKey = 'mCEfGLoClkjoI6eF4Qm0x9q8a26WJFDM'; 

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://api-gateway.skymavis.com/skynet/ronin/blocks/finalized',
      headers: { 
        'Accept': 'application/json', 
        'X-API-KEY': apiKey
      }
    };

    axios(config)
      .then((response) => {
        console.log("Fetched data:", response.data); 
        const blockNumber = response.data.result.blockNumber;
        setFinalizedBlockNumber(blockNumber);
      })
      .catch((error) => {
        console.error("Error fetching last finalized block:", error);
        setError('Failed to fetch data');
      });
  };

  useEffect(() => {
    fetchLastFinalizedBlock();
  }, []);

  return (
    <div>
      <h1>Last Finalized Block</h1>
      {finalizedBlockNumber ? (
        <div>
          <p>Block Number: {finalizedBlockNumber}</p>
        </div>
      ) : (
        <p>{error || "Loading..."}</p>
      )}
    </div>
  );
};

export default FetchFinalizedBlock;
