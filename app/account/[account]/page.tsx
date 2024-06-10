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

  /* const [transactions, setTransactions] = useState<Transaction[]>([]);
   */ const [isLoading, setIsLoading] = useState(true);


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
    if (ethers.isAddress(address)) {
      try {
        const balanceResult = await getBalance(client, {
          address: address as `0x${string}`,
        });
        setBalance(ethers.formatEther(balanceResult.valueOf())); // Assuming the balance is in 'value' and in 'wei'
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance("Error");
      }
    }
  };

  /* const fetchTransactionsWagmi = async (address: string) => {
    setIsLoading(true);
    if (ethers.isAddress(address)) {
      try {
        const transactionResult = await getTransaction(client, {
          hash: address as `0x${string}`, // Assuming you want to fetch transactions based on hash
        });
        setTransactions([transactionResult]); // Update the state with the fetched transactions
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    }
  }; */
  const fetchTransactions = async (address: string) => {
    const API_ETHER_KEY = "DCBMMRGDHRZ9ZAXN9F98II2JQ2GREDSG29";

    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${API_ETHER_KEY}`
      );
      if (response.data.status === "1" && response.data.result) {
        const hashes = response.data.result.map(
          (tx: { hash: string }) => tx.hash
        );
        setTransactionHashes(hashes);
      } else {
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
  };

  const fetchERC721Transactions = async (address: string) => {
    const API_ETHER_KEY = "5FKGRH8CW2C4TIW9ME321HB6XXY53HZZP1";

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
    }
  };
 
  const runApp = async (address: string) => {
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

      console.log("ERC-20 holdings are ", response.toJSON());
    } catch (error :any) {
      if (error.message.includes('over 2000 tokens')) {
        console.error("Wallet contains over 2000 tokens, unable to fetch all balances.");
      } else {
        console.error("Error fetching wallet token balances:", error);
      }
    }
  };
  const fetchERC1155Transactions = async (address: string) => {
    const API_ETHER_KEY = "DCBMMRGDHRZ9ZAXN9F98II2JQ2GREDSG29";

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
  return (
    <div>
      {!accountAddress ? (
        <div>Loading account details...</div>
      ) : (
        <>
          <h1>Account Details for {accountAddress}</h1>
          <p>Balance: {balance} ETH</p>
          <h3>Recent Transactions</h3>
          {isLoading ? (
            <p>Loading transactions...</p>
          ) : transactionHashes.length > 0 ? (
            <ul>
              {transactionHashes.map((hash, index) => (
                <li key={index}>Transaction Hash: {hash}</li>
              ))}
            </ul>
          ) : (
            <p>No transactions found.</p>
          )}
  <TokenTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} />
          {renderTable()}
        </>
      )}
    </div>
  );
}
