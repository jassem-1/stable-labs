"use client";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import axios from "axios";
import ConnectWalletButton from "../ConnectWallet";
import Link from "next/link";

const Header: React.FC = () => {
  const [price, setPrice] = useState([]);
  const [updatedPriceDate, setUpdatedPriceDate] = useState("");
  const [gasPrice, setGasPrice] = useState("");

  const getEtherPrice = () => {
    try {
      const API_ETHER_KEY = "DCBMMRGDHRZ9ZAXN9F98II2JQ2GREDSG29";

      axios
        .get(
          `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${API_ETHER_KEY}`
        )
        .then((response) => {
          setPrice(response.data.result.ethusd);
          const timestamp = Number(response.data.result.ethusd_timestamp);

          const date = new Date(timestamp);
          setUpdatedPriceDate(
            "UpDate:" +
              date.getHours() +
              ":" +
              date.getMinutes() +
              ":" +
              date.getSeconds()
          );
          console.log("timeee", timestamp);
          console.log("ether price");

        });
    } catch (error) {
      console.log(error);
    }
  };

  const getGasPrice = () => {
    const API_ETHER_KEY = "5FKGRH8CW2C4TIW9ME321HB6XXY53HZZP1";
    axios
      .get(
        `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${API_ETHER_KEY}`
      )
      .then((response) => {
         const safeGasPrice = response.data.result.SafeGasPrice;
        setGasPrice(safeGasPrice); 
    
      })
      .catch((error) => {
        console.error("Error fetching gas price:", error);
      });
  };

  useEffect(() => {
    getEtherPrice();
    getGasPrice();
  }, []);

  useEffect(() => {
    console.log(`Safe Gas Price: ${gasPrice} Gwei`);
  }, [gasPrice]);

  useEffect(() => {
    console.log(updatedPriceDate);
  }, [updatedPriceDate]);

  return (
    <div className="fixed w-full bg-[#172554] shadow-lg p-2 z-20">
      <div className="flex justify-between items-center w-full px-8 py-1">
        <div>
          <Link href="/">
          <img src={logo.src} alt="" className="w-10 h-10" />
          </Link>
        </div>
        <ul className="menu flex justify-center items-center gap-x-8 text-2xl cursor-pointer"></ul>
        <div className="flex items-center gap-x-8 cursor-pointer">
          <div className="">
            <button className="px-4 rounded-2xl text-sm border border-white text-white hover:bg-black">
              login
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center w-full ">
        <div className="flex flex-col text-white">
          <p>ether price : $ {price} </p>
          <p>gas price : {gasPrice} Gwei</p>
        </div>
        <ConnectWalletButton
        buttonText="Connect Wallet"
      />
      </div>
    </div>
  );
};

export default Header;
