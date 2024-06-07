"use client";
import { useContext, useState } from "react";
import { EtherscanContext } from "./RootLayoutContext";
import { ethers } from "ethers";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const context = useContext(EtherscanContext);
  const [userAccount, setUserAccount] = useState<string>("");

  const convertIntoETH = (amount: any) => {
    const ETH = ethers.formatUnits(amount, "ether");
    return ETH;
  };

  const accountAddress = (event: React.FormEvent) => {
    event.preventDefault();
    const element = document.getElementById(
      "accountAddress"
    ) as HTMLInputElement;

    if (element) {
      const address = element.value.trim();
      if (address) {
        setUserAccount(address);
        router.push(`/account?${address}`);
        element.value = "";
      } else {
        console.error("No address provided");
      }
    } else {
      console.error("Element not found");
    }
  };

  if (!context) {
    throw new Error("Home must be used within a EtherProvider");
  }

  const { data, tenBlockWithDetails, transaction } = context;
  console.log(tenBlockWithDetails);

  return (
    <div className="pt-32 py-16">
      <div className="bg-gray-100 p-5">
        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Ether Account address"
            id="accountAddress"
            className="p-2 border border-gray-300 rounded"
          />
          <Link href={{ pathname: "/account", query: { userAccount } }}>
            <button
              onClick={accountAddress}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Connect Wallet
            </button>
          </Link>
        </form>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-bold my-2">Latest Blocks</h3>
        <div className="space-y-4">
          {tenBlockWithDetails.map((el, i) => (
            <div key={i + 1} className="bg-white shadow-lg p-5 rounded-lg">
              <div className="flex flex-col space-y-2">
                <p className="text-blue-600">
                  <Link href={`/block/${el.number.toString()}`}>
                    Block Number: {el.number}
                  </Link>
                </p>
                <p>Timestamp: {el.timestamp}</p>
                <div>
                  <p>
                    Miner:{" "}
                    <Link
                      href={{
                        pathname: "/account",
                        query: { miner: el.miner },
                      }}
                    >
                      {el.miner.slice(0, 35)}...
                    </Link>
                  </p>
                  <p>
                    Transactions:{" "}
                    <Link
                      href={{
                        pathname: "/account",
                        query: { number: el.number.toString() },
                      }}
                    >
                      {el.transactions.length}
                    </Link>{" "}
                    in last 3 sec
                  </p>
                </div>
                <div>
                  <p>Base Fee: {convertIntoETH(el.baseFeePerGas)} ETH</p>
                  <Image
                    src="/path/to/etherLogo.png"
                    alt="Ether logo"
                    width={40}
                    height={40}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-bold my-2">Latest Transactions</h3>
                <div className="space-y-4">
                  {transaction?.transactions.map((txHash, i) => (
                    <div key={i} className="bg-white shadow-lg p-5 rounded-lg">
                      <div className="flex justify-between">
                        <p className="text-blue-600">
                        <Link href={`/transaction/${transaction.transactions[i]}`}>
          Transaction: {txHash.slice(0, 55)}
        </Link>

                        </p>
                      </div>
                    </div>
                  ))}
                </div>
      </div>
    </div>
  );
}
