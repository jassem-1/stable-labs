import { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

const MarketCap = () => {
  const [totalSupply, setTotalSupply] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [marketCap, setMarketCap] = useState('');

  useEffect(() => {
    const fetchTotalSupply = async () => {
      const API_ETHER_KEY = "DXIGPJTP9BMKHIGVTCEJG3PF3MXEXU1GXI";
      try {
        const response = await axios.get(
          `https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=${API_ETHER_KEY}`
        );
        if (response.data.status === "1" && response.data.result) {
          const supply = ethers.formatEther(response.data.result);
          setTotalSupply(supply);
        }
      } catch (error) {
        console.error("Error fetching total Ether supply:", error);
      }
    };

    const fetchCurrentPrice = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        if (response.data.ethereum.usd) {
          setCurrentPrice(response.data.ethereum.usd);
        }
      } catch (error) {
        console.error("Error fetching Ethereum price:", error);
      }
    };

    fetchTotalSupply();
    fetchCurrentPrice();
  }, []);

  useEffect(() => {
    if (totalSupply && currentPrice ) {
      const cap = parseFloat(totalSupply) * Number(currentPrice);
      setMarketCap(cap.toFixed(2));
    }
  }, [totalSupply, currentPrice]);

  return (
    <div>
      <h1>Ethereum Market Cap</h1>
      <p>Total Supply: {totalSupply} ETH</p>
      <p>Current Price: ${currentPrice} USD</p>
      <p>Market Cap: ${marketCap} USD</p>
    </div>
  );
};

export default MarketCap;
