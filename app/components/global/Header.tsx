"use client"
import { useState } from "react";
import logo from "../../assets/logo.png";

const Header: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleItemClick = (index: number): void => {
    setActiveIndex(index);
  };

  return (
    <div className='fixed w-full bg-[#172554] shadow-lg h-[48px] z-20'>
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
    </div>
  )
}

export default Header;
