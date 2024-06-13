import { useState, useEffect } from 'react';
import axios from 'axios';
import { ImSpinner2 } from 'react-icons/im';
import { MdAccessTime } from 'react-icons/md'; // Time icon

const FetchFinalizedBlock = () => {
  const [finalizedBlockNumber, setFinalizedBlockNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLastFinalizedBlock = () => {
    const apiKey = 'mCEfGLoClkjoI6eF4Qm0x9q8a26WJFDM'; 
    setLoading(true);

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
        const blockNumber = response.data.result.blockNumber;
        setFinalizedBlockNumber(blockNumber);
      })
      .catch((error) => {
        console.error("Error fetching last finalized block:", error);
        setError('Failed to fetch data');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLastFinalizedBlock();
  }, []);

  return (
    <div className="bg-black bg-opacity-30 p-3 text-white rounded-lg shadow-lg blur-background flex items-center space-x-3">
      <MdAccessTime className="text-blue-500 text-3xl" /> {/* Time icon */}
      <div className="flex-grow">
        <h1 className="text-lg font-semibold">Last Finalized Block</h1>
        {loading ? (
          <div className="flex items-center space-x-2">
            <ImSpinner2 className="animate-spin text-xl" />
            <span>Loading...</span>
          </div>
        ) : finalizedBlockNumber ? (
          <p>Block Number: {finalizedBlockNumber}</p>
        ) : (
          <p>{error || "Failed to load data"}</p>
        )}
      </div>
    </div>
  );
};

export default FetchFinalizedBlock;
