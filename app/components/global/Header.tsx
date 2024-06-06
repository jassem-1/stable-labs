"use client";
import { useEffect } from "react";
import logo from "../../assets/logo.png";
import axios from "axios";

const Header: React.FC = () => {

  const getEtherPrice = ()  => {
    try {
      const API_ETHER_KEY="5FKGRH8CW2C4TIW9ME321HB6XXY53HZZP1"
      axios.get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${API_ETHER_KEY}`).then(response =>
      {  console.log(response.data.result) } )
        
    } catch (error) { console.log(error); }
  }
  useEffect(() => {getEtherPrice()}, []);
  return (
    <div className='fixed w-full bg-[#172554] shadow-lg  z-20'>
      <div className="flex justify-between items-center w-full px-8 py-1">
        <div>
            <img src={logo.src} alt="" className="w-10 h-10"/>
        </div>
        <ul className="menu flex justify-center items-center gap-x-8 text-2xl cursor-pointer">
          
        </ul>
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
        <p>ether price : </p>
        <p>gas price : </p>
        </div>
        <div>
          <button className="px-4 py-1 bg-white border border-black rounded-2xl ">connect wallet</button>
        </div>
      </div>
    </div>
  )
}

export default Header;
