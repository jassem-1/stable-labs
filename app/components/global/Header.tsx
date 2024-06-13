"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ImSpinner2 } from 'react-icons/im'; // Import a spinner icon
import ConnectWalletButton from "../ConnectWallet";
import Link from "next/link";
import logo from "../../assets/logo.png";

const Header: React.FC = () => {
  const [price, setPrice] = useState("");
  const [priceLoading, setPriceLoading] = useState(true); // Loading state for price
  const [updatedPriceDate, setUpdatedPriceDate] = useState("");
  const [gasPrice, setGasPrice] = useState("");
  const [gasPriceLoading, setGasPriceLoading] = useState(true); // Loading state for gas price

  const getEtherPrice = () => {
    setPriceLoading(true); // Start loading
    const API_ETHER_KEY = "DCBMMRGDHRZ9ZAXN9F98II2JQ2GREDSG29";
    axios
      .get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${API_ETHER_KEY}`)
      .then((response) => {
        setPrice(response.data.result.ethusd);
        setPriceLoading(false); // Stop loading
        const timestamp = Number(response.data.result.ethusd_timestamp);
        const date = new Date(timestamp);
        setUpdatedPriceDate("Updated:" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
      })
      .catch((error) => {
        console.error("Error fetching Ether price:", error);
        setPriceLoading(false); // Stop loading
      });
  };

  const getGasPrice = () => {
    setGasPriceLoading(true); // Start loading
    const API_ETHER_KEY = "5FKGRH8CW2C4TIW9ME321HB6XXY53HZZP1";
    axios
      .get(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${API_ETHER_KEY}`)
      .then((response) => {
        setGasPrice(response.data.result.SafeGasPrice);
        setGasPriceLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error("Error fetching gas price:", error);
        setGasPriceLoading(false); // Stop loading
      });
  };

  useEffect(() => {
    getEtherPrice();
    getGasPrice();
  }, []);

  return (
    <div className=" w-full  bg-transparent shadow-lg px-8 py-2 z-20">
      <div className="flex justify-between items-center w-full ">
        <div>
          <Link href="/">
            <img src={logo.src} alt="" className="w-16 h-16" />
          </Link>
        </div>
        <div className="flex items-center gap-x-8 cursor-pointer">
          <button className="px-4 rounded-2xl text-sm border border-white text-white hover:scale-110">login</button>
        </div>
      </div>
      <div className="neon my-4"></div>

      <div className="flex justify-between items-center w-full text-white">
        <div className="flex flex-col gap-y-3">
          {priceLoading ? <ImSpinner2 className="animate-spin" /> : <p>Ether price: ${price}</p>}
          {gasPriceLoading ? <ImSpinner2 className="animate-spin" /> : <p>Gas price: {gasPrice} Gwei</p>}
        </div> 
        
        <ConnectWalletButton buttonText="Connect Wallet" />
      </div>
    </div>
  );
};

export default Header;
