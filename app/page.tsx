"use client";;
import { useContext } from "react";
import { EtherscanContext } from "./RootLayoutContext";
import { ethers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FetchFinalizedBlock from "./components/eth_data/FinalizedBlock";
import MarketCap from "./components/eth_data/MarketCap";
import { MdSearch } from 'react-icons/md';

export default function Home() {
  const router = useRouter();
  const context = useContext(EtherscanContext);

  const convertIntoETH = (amount: any) => {
    const ETH = ethers.formatUnits(amount, "ether");
    return ETH;
  };



  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const element = document.getElementById("searchInput") as HTMLInputElement;

    if (element) {
      const query = element.value.trim();
      if (query) {
        if (ethers.isAddress(query)) {
          // It's an account address
          router.push(`/account/${query}`);
        } else if (/^\d+$/.test(query)) {
          // It's a block number
          router.push(`/block/${query}`);
        } else if (/^0x([A-Fa-f0-9]{64})$/.test(query)) {
          // It's a transaction hash
          router.push(`/transaction/${query}`);
        } else {
          console.error("Invalid input");
        }
        element.value = "";
      } else {
        console.error("No input provided");
      }
    } else {
      console.error("Element not found");
    }
  };


  if (!context) {
    throw new Error("Home must be used within a EtherProvider");
  }

  const {  tenBlockWithDetails, transaction } = context;
  console.log(tenBlockWithDetails);

  return (
    <div className=" py-16 ">
      <div className="px-3">
      <FetchFinalizedBlock/>
      <MarketCap/>
      </div>
      
      <div className="w-full bg-black bg-opacity-30 text-white rounded-lg shadow-lg blur-background p-5">
      <form className="flex gap-x-3" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by Account Address, Block Number, or Transaction Hash"
            id="searchInput"
            className="p-2 border w-[90%] border-gray-300 bg-transparent rounded"
          />
             <button
      type="submit"
      className="flex items-center justify-center border border-white text-white font-bold py-2 px-4 rounded"
    >
      <MdSearch className="mr-2" />
      Search
    </button>
        </form>
      </div>

      <div className="py-16 text-white max-w-6xl justify-center items-start  mx-auto flex gap-x-4">
      <div className="w-1/2 p-4 bg-black bg-opacity-40 text-white rounded-lg shadow-lg blur-background  ">
        <h3 className="text-lg  text-white font-semibold my-2">Latest Blocks</h3>
        <div className="max-h-96 min-w-[40%] overflow-y-auto scrollable space-y-4 p-2  ">
    
          {tenBlockWithDetails.slice(0, 6).map((el, i) => (
            <div key={i + 1} className=" hover:border hover:border-white shadow-lg p-5 rounded-2xl">
              <div className="flex flex-col space-y-2">
                <p className="text-white">
                  <Link href={`/block/${el.number.toString()}`}>
                  <span className="rounded-xl bg-opacity-30 bg-black p-1">Block Number:</span>
                   <span className="text-[#00ffffbf]">{el.number}</span> 
                  </Link>
                </p>
                <p>Timestamp: {new Date(el.timestamp * 1000).toLocaleString()}</p>
                <div>
                  <p>
                    Miner:{' '}
                    <Link href={`/account/${el.miner}`}>
                      {el.miner.slice(0, 35)}...
                    </Link>
                  </p>
                  <p>
                    Transactions:{' '}
                    <Link href={`/block/${el.number.toString()}`}>
                      {el.transactions.length}
                    </Link>{' '}
                    in last 3 sec
                  </p>
                </div>
                <div>
                  <p>Base Fee: {convertIntoETH(el.baseFeePerGas)} ETH</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/2 p-4 bg-black bg-opacity-40 text-white rounded-lg shadow-lg blur-background ">
        <h3 className="  text-lg font-bold my-2">Latest Transactions</h3>
        <div className="max-h-96 scrollable overflow-y-auto space-y-4 p-2  rounded-lg">
          {transaction?.transactions.slice(0, 6).map((txHash, i) => (
            <div key={i} className=" shadow-lg p-2 rounded-lg">
              <div className="flex justify-between">
                <p className="text-white p-2 rounded-2xl hover:border hover:border-white">
                  <Link href={`/transaction/${txHash}`} className="text-sm">
                   <span className="text-white text-base">Transaction:</span>   {txHash.slice(0, 55)}
                  </Link>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}
