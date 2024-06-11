"use client";;
import { useContext, useState } from "react";
import { EtherscanContext } from "./RootLayoutContext";
import { ethers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const context = useContext(EtherscanContext);
  const [userAccount, setUserAccount] = useState<string>("");

  const convertIntoETH = (amount: any) => {
    const ETH = ethers.formatUnits(amount, "ether");
    return ETH;
  };

/*   const accountAddress = (event: React.FormEvent) => {
    event.preventDefault();
    const element = document.getElementById(
      "accountAddress"
    ) as HTMLInputElement;

    if (element) {
      const address = element.value.trim();
      if (address) {
        setUserAccount(address);
        router.push(`/account/${address}`);
        element.value = "";
      } else {
        console.error("No address provided");
      }
    } else {
      console.error("Element not found");
    }
  }; */

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
      <div className="bg-gray-100 p-5">
      <form className="flex flex-col space-y-4" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by Account Address, Block Number, or Transaction Hash"
            id="searchInput"
            className="p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Search
          </button>
        </form>
      </div>

      <div className="py-16 max-w-6xl mx-auto flex gap-x-4">
      <div className="mt-10">
        <h3 className="text-lg font-bold my-2">Latest Blocks</h3>
        <div className="max-h-96 overflow-y-auto space-y-4 p-2 border border-gray-300 rounded-lg">
          {tenBlockWithDetails.slice(0, 6).map((el, i) => (
            <div key={i + 1} className="bg-white shadow-lg p-5 rounded-lg">
              <div className="flex flex-col space-y-2">
                <p className="text-blue-600">
                  <Link href={`/block/${el.number.toString()}`}>
                    Block Number: {el.number}
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

      <div className="mt-10">
        <h3 className="text-lg font-bold my-2">Latest Transactions</h3>
        <div className="max-h-96 overflow-y-auto space-y-4 p-2 border border-gray-300 rounded-lg">
          {transaction?.transactions.slice(0, 6).map((txHash, i) => (
            <div key={i} className="bg-white shadow-lg p-5 rounded-lg">
              <div className="flex justify-between">
                <p className="text-blue-600">
                  <Link href={`/transaction/${txHash}`}>
                    Transaction: {txHash.slice(0, 55)}
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
