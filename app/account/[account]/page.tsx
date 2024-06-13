"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getBalance } from "viem/actions";
import { client } from "@/app/wagmi_config/config";
import axios from "axios";
import TokenTable from "../components/RenderTable";
import TokenTabs from "../components/TokenTabs";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { FaAngleDown, FaAngleUp, FaSpinner } from "react-icons/fa";

type TokenTransaction = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenId: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
};

type Transaction = {
  hash: string;
};
let isMoralisStarted = false;

export default function AccountPage() {
  const [accountAddress, setAccountAddress] = useState("");
  const [transactionHashes, setTransactionHashes] = useState<string[]>([]);

  const [selectedTab, setSelectedTab] = useState('ERC-20');
  const [showTransactionDropdown, setShowTransactionDropdown] = useState(false);
  const [currentTransactionPage, setCurrentTransactionPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [tokenHoldings, setTokenHoldings] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 7;

  const [balance, setBalance] = useState("0");
  const [erc20Transactions, setErc20Transactions] = useState<
    TokenTransaction[]
  >([]);
  const [erc721Transactions, setErc721Transactions] = useState<
    TokenTransaction[]
  >([]);
  const [erc1155Transactions, setErc1155Transactions] = useState<
    TokenTransaction[]
  >([]);

  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split("/");
    const address = parts[parts.length - 1];
    if (ethers.isAddress(address)) {
      const formattedAddress = ethers.getAddress(address); // Ensure checksum address

      setAccountAddress(formattedAddress);
      fetchTransactions(formattedAddress);
      /*       fetchTransactionsWagmi(formattedAddress);
       */ fetchBalance(formattedAddress);
      fetchERC20Transactions(formattedAddress);
      fetchERC721Transactions(formattedAddress);
      fetchERC1155Transactions(formattedAddress);
      runApp(formattedAddress);
    }
  }, []);

  const fetchBalance = async (address: any) => {
    setIsLoading(true)
    if (ethers.isAddress(address)) {
      try {
       
        const balanceResult = await getBalance(client, {
          address: address as `0x${string}`,
        });
        setBalance(ethers.formatEther(balanceResult.valueOf())); 
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance("Error");
      }
    }
    setIsLoading(false)
  };


  const fetchTransactions = async (address: string) => {
    const API_ETHER_KEY = "DCBMMRGDHRZ9ZAXN9F98II2JQ2GREDSG29";
    setIsLoading(true)
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=30&sort=asc&apikey=${API_ETHER_KEY}`
      );
      if (response.data.status === "1" && response.data.result) {
        const transactions = response.data.result.map((tx: any) => ({
            hash: tx.hash,
            value: tx.value // This is the value in wei
        }));
        setTransactionHashes(transactions);}
         else {
        console.error("API Error:", response.data);
        setTransactionHashes([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactionHashes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchERC20Transactions = async (address: string) => {
    const API_ETHER_KEY = "KR57X3MVZUU24DCBMNX3ZABVF4PUXKPVAH";
    setIsLoading(true)
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=${API_ETHER_KEY}`
      );
      if (response.data.status === "1" && response.data.result) {
        setErc20Transactions(response.data.result);
      } else {
        console.error("API Error:", response.data);
        setErc20Transactions([]);
      }
    } catch (error) {
      console.error("Error fetching ERC-20 transactions:", error);
      setErc20Transactions([]);
    }
    finally {
      setIsLoading(false);
    }
  };

  const fetchERC721Transactions = async (address: string) => {
    const API_ETHER_KEY = "5FKGRH8CW2C4TIW9ME321HB6XXY53HZZP1";
    setIsLoading(true)
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${address}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=${API_ETHER_KEY}`
      );
      if (response.data.status === "1" && response.data.result) {
        setErc721Transactions(response.data.result);
      } else {
        console.error("API Error:", response.data);
        setErc721Transactions([]);
      }
      
    } catch (error) {
      console.error("Error fetching ERC-721 transactions:", error);
      setErc721Transactions([]);
    }finally {
      setIsLoading(false);
    }
  };
 
  const runApp = async (address: string) => {
    setIsLoading(true);

    if (!isMoralisStarted) {
      await Moralis.start({
        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijk5OWFmZTI4LTQ4NmUtNGNlZS04YmJjLTc2ZWE2OWYyYTNlYSIsIm9yZ0lkIjoiMzk1ODg1IiwidXNlcklkIjoiNDA2Nzk5IiwidHlwZUlkIjoiMGUyOWMyZTgtNzQ1My00ZGYzLWI0NmYtN2NkYjIwYzYzMDFjIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTgwNTI2MzgsImV4cCI6NDg3MzgxMjYzOH0.ri5uFEgtz6l4iEdQB79hxj0w_O27TMP-YWXEVAlXaJU",
      });
      isMoralisStarted = true;
    }

    try {
      const chain = EvmChain.ETHEREUM;

      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        address,
        chain,

      });

      setTokenHoldings(response.toJSON());
    } catch (error :any) {
      if (error.message.includes('over 2000 tokens')) {
        console.error("Wallet contains over 2000 tokens, unable to fetch all balances.");
      } else {
        console.error("Error fetching wallet token balances:", error);
      }
    }
    finally {
      setIsLoading(false);
    }
  };
  const fetchERC1155Transactions = async (address: string) => {
    const API_ETHER_KEY = "DCBMMRGDHRZ9ZAXN9F98II2JQ2GREDSG29";
    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=token1155tx&address=${address}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=${API_ETHER_KEY}`
      );
      if (response.data.status === "1" && response.data.result) {
        setErc1155Transactions(response.data.result);
      } else {
        console.error("API Error:", response.data);
        setErc1155Transactions([]);
      }
    } catch (error) {
      console.error("Error fetching ERC-1155 transactions:", error);
      setErc1155Transactions([]);
    }finally {
      setIsLoading(false);
    }
  };

  const renderTable = () => {
    switch (selectedTab) {
      case 'ERC-20':
        return <TokenTable transactions={erc20Transactions} tokenType="ERC-20" />;
      case 'ERC-721':
        return <TokenTable transactions={erc721Transactions} tokenType="ERC-721" />;
      case 'ERC-1155':
        return <TokenTable transactions={erc1155Transactions} tokenType="ERC-1155" />;
      default:
        return null;
    }
  };
  const handleToggleTransactionDropdown = () => {
    setShowTransactionDropdown(!showTransactionDropdown);
  };

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const paginate = (items: any[], pageNumber: number, pageSize: number) => {
    const startIndex = (pageNumber - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  };

  const nextTransactionPage = () => {
    if (currentTransactionPage * itemsPerPage < transactionHashes.length) {
      setCurrentTransactionPage(currentTransactionPage + 1);
    }
  };

  const previousTransactionPage = () => {
    if (currentTransactionPage > 1) {
      setCurrentTransactionPage(currentTransactionPage - 1);
    }
  };
  const nextPage = () => {
    if (currentPage * itemsPerPage < tokenHoldings.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <FaSpinner className="animate-spin text-4xl text-white" />
      </div>
    );
  }

  return (
    <div className="p-16">
      <div className=" bg-black bg-opacity-30 text-white rounded-lg  blur-background shadow-lg p-6">
        {!accountAddress ? (
          <div>
            <FaSpinner className="animate-spin text-4xl text-white" />
            Loading account details...
          </div>
        ) : (
          <>
          <div className="flex flex-col gap-y-2 pb-3">
          <h1 >Account Details for {accountAddress}</h1>
          <p className="border border-white  rounded-2xl w-[250px] text-white  p-2 ">Balance: {balance} ETH</p>
          </div>
          
            <div className="w-full flex items-start gap-x-3">
            <div className="p-3  relative w-full bg-black bg-opacity-70 blur-background rounded-lg">
              <div className="flex justify-between w-full items-center gap-x-2 mb-2  text-[#0ff]" onClick={handleToggleTransactionDropdown}>
                <button>
                  Recent Transactions: {transactionHashes.length}
                </button>
                {
                  showTransactionDropdown ? <FaAngleUp /> : <FaAngleDown />
                }
              </div>
              {showTransactionDropdown && (
                <>
                  {isLoading ? (
                    <p>Loading transactions...</p>
                  ) : transactionHashes.length > 0 ? (
                    <ul className="space-y-4 max-w-[650px] p-2 min-h-[450px]">
                      {paginate(transactionHashes, currentTransactionPage, itemsPerPage).map((transaction: any, index) => (
                        <li key={index}>
                          Hash: {transaction.hash.substring(0, 14)}..., Value: {ethers.formatEther(transaction.value)} ETH
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No transactions found.</p>
                  )}
                  <div className="flex absolute bottom-3 right-3 w-[95%] justify-between">
                    <button onClick={previousTransactionPage} disabled={currentTransactionPage === 1} className="border border-white p-2 rounded-2xl">
                      Previous
                    </button>
                    <button onClick={nextTransactionPage} disabled={currentTransactionPage * itemsPerPage >= transactionHashes.length} className="border border-white p-2 rounded-2xl">
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="relative p-3 w-full  bg-black bg-opacity-70 blur-background rounded-lg">
              <div className="flex justify-between w-full items-center gap-x-2 mb-2  text-[#0ff]"  onClick={handleToggleDropdown}>
              <button>
                Token Holdings: {tokenHoldings.length} 

              </button>
              {
                showDropdown ? <div>
                  <FaAngleUp />
                  </div> : 
                <div>
                  <FaAngleDown />

                </div>
              }
            
              </div>
             
              {showDropdown && (
                <div className="w-full min-h-[450px]">
                  <ul>
                    {paginate(tokenHoldings, currentPage, itemsPerPage).map((token, index) => (
                      <li key={index} className=" px-3 py-3 ">
                        {token.name} - {token.token_address}
                      </li>
                    ))}
                  </ul>
                  <div className="flex px-4 right-1 w-full justify-between absolute bottom-3">
                    <button onClick={previousPage} disabled={currentPage === 1} className="border border-white p-2 rounded-2xl">
                      Previous
                    </button>
                    <button onClick={nextPage} disabled={currentPage * itemsPerPage >= tokenHoldings.length} className="border border-white p-2 rounded-2xl">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
            </div>
            
           
           
            <div className="border mt-4 border-white rounded-2xl p-4">
            <TokenTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} />
            {renderTable()}
            </div>
           
          </>
        )}
      </div>
    </div>
  );
}
