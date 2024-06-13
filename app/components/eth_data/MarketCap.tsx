import { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { FaEthereum } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { BiStats } from "react-icons/bi";
import { ImSpinner2 } from "react-icons/im";
const MarketCap = () => {
  const [totalSupply, setTotalSupply] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [marketCap, setMarketCap] = useState("");
  const [loadingSupply, setLoadingSupply] = useState(true);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [loadingCap, setLoadingCap] = useState(true);

  useEffect(() => {
    const fetchTotalSupply = async () => {
      setLoadingSupply(true);
      try {
        const API_ETHER_KEY = "DXIGPJTP9BMKHIGVTCEJG3PF3MXEXU1GXI";
        const response = await axios.get(
          `https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=${API_ETHER_KEY}`
        );
        if (response.data.status === "1" && response.data.result) {
          const supply = ethers.formatEther(response.data.result);
          setTotalSupply(supply);
        } else {
          setTotalSupply("Failed to fetch data");
        }
      } catch (error) {
        setTotalSupply("Failed to fetch data");
      } finally {
        setLoadingSupply(false);
      }
    };

    const fetchCurrentPrice = async () => {
      setLoadingPrice(true);
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        if (response.data.ethereum.usd) {
          setCurrentPrice(response.data.ethereum.usd);
        } else {
          setCurrentPrice("Failed to fetch data");
        }
      } catch (error) {
        setCurrentPrice("Failed to fetch data");
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchTotalSupply();
    fetchCurrentPrice();
  }, []);

  useEffect(() => {
    if (totalSupply && currentPrice) {
      setLoadingCap(true);
      const cap = parseFloat(totalSupply) * Number(currentPrice);
      setMarketCap(cap.toFixed(2));
      setLoadingCap(false);
    }
  }, [totalSupply, currentPrice]);

  return (
    <div className=" py-4 grid grid-cols-3 p-3 gap-4">
      <div className="bg-black bg-opacity-30 text-white rounded-lg shadow-lg blur-background flex items-center space-x-3">
        <FaEthereum className="text-gray-700 text-3xl" />
        <div>
          <h2 className="font-semibold text-lg">Total Supply</h2>
          {loadingSupply ? (
            <ImSpinner2 className="animate-spin text-xl" />
          ) : (
            <p>{totalSupply} ETH</p>
          )}
        </div>
      </div>
      <div className="bg-black bg-opacity-30 p-3 text-white rounded-lg shadow-lg blur-background flex items-center space-x-3">
        <MdAttachMoney className="text-green-600 text-3xl" />
        <div>
          <h2 className="font-semibold text-lg">Current Price</h2>
          {loadingPrice ? (
            <ImSpinner2 className="animate-spin text-xl" />
          ) : (
            <p>${currentPrice} USD</p>
          )}
        </div>
      </div>
      <div className="bg-black bg-opacity-30 p-3 text-white rounded-lg shadow-lg blur-background flex items-center space-x-3">
        <BiStats className="text-blue-500 text-3xl" />
        <div>
          <h2 className="font-semibold text-lg">Market Cap</h2>
          {loadingCap ? (
            <ImSpinner2 className="animate-spin text-xl" />
          ) : (
            <p>${marketCap} USD</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketCap;
