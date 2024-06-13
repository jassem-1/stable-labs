"use client";;
import { ethers } from "ethers";
import { createContext, ReactNode, FC, useEffect, useState } from "react";
import { Block, TransactionResponse } from "ethers";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from "./wagmi_config/config";
import { User } from "@supabase/supabase-js";

const queryClient = new QueryClient()

interface EtherscanContextProps {
  currentBlock: number[];
  topTenBlock: number[];
  provider: ethers.JsonRpcProvider;
  gasPrice: string | null;
  transaction: Block | null;  
  tenBlockWithDetails: any[];  
  transactionDetails: TransactionResponse | null;
  getTransactionDetails: (txHash: string) => Promise<TransactionResponse | null>;
  blockDetails: Block | null;

  getBlockDetails: (blockNumber: number) => Promise<Block | null>;

}

const infuraApiKeys = [
  process.env.NEXT_PUBLIC_INFURA_API_KEY,
  process.env.NEXT_PUBLIC_INFURA_API_KEY_SECOND
];

if (!infuraApiKeys[0] || !infuraApiKeys[1]) {
  throw new Error("Infura API keys are not defined");
}
let lastUsedIndex = 0;

function getNextApiKey() {
  const apiKey = infuraApiKeys[lastUsedIndex];
  lastUsedIndex = (lastUsedIndex + 1) % infuraApiKeys.length; 
  return apiKey;
}
const infuraApiKey = getNextApiKey();


const provider = new ethers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${infuraApiKey}`
);
const EtherscanContext = createContext<EtherscanContextProps | undefined>(
  undefined
);

const EtherProvider: FC<{ children: ReactNode }> = ({ children }) => {

  const [currentBlock, setCurrentBlock] = useState<number[]>([]);
  const [transaction, setTransaction] = useState<Block | null>(null);

  const [topTenBlock, setTopTenBlock] = useState<number[]>([]);
  const [tenBlockWithDetails, setTenBlockWithDetails] = useState<any[]>([]);

  const [gasPrice, setGasPrice] = useState<string | null>(null);

  const [transactionDetails, setTransactionDetails] = useState<TransactionResponse | null>(null);
  const [blockDetails, setBlockDetails] = useState<Block | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  

  const accountDetails = async () => {
    try {
      const getCurrentBlock = await provider.getBlockNumber();
      setCurrentBlock([getCurrentBlock]);

      console.log("block number is", getCurrentBlock);

      const blockTransaction = await provider.getBlock(getCurrentBlock);
      setTransaction( blockTransaction);
      // TOP TEN BLOCK  
      const previousBlock = getCurrentBlock - 10;
      const listTenBlock = [];

      for (let i = getCurrentBlock; i > previousBlock; i--) {
        listTenBlock.push(i);
      }

      const getBlockDetails = listTenBlock.flat();
      setTopTenBlock(getBlockDetails);
      
      getBlockDetails.map(async (el) => {
          const singleBlockData = await provider.getBlock(el);
          tenBlockWithDetails.push(singleBlockData);
          console.log(singleBlockData);
      });
      console.log("tenblocks",tenBlockWithDetails);

      const gasPrice = (await provider.getFeeData()).gasPrice;
      const latestGasPrice = gasPrice ? ethers.formatUnits(gasPrice, "ether") : null;
      setGasPrice(latestGasPrice);


    } catch (error) {
      console.log("Something went wrong while fetching data", error);
    }
  };
  const getTransactionDetails = async (txHash: string): Promise<TransactionResponse | null> => {
    try {
      const details = await provider.getTransaction(txHash);
      setTransactionDetails(details);
      return details;
    } catch (error) {
      console.error("Failed to fetch transaction details:", error);
      return null;
    }
  };
  const getBlockDetails = async (blockNumber: number): Promise<Block | null> => {
    try {
      const details = await provider.getBlock(blockNumber);
      setBlockDetails(details);
      return details;
    } catch (error) {
      console.error("Failed to fetch block details:", error);
      return null;
    }
  };


  useEffect(() => {
    accountDetails();
  }, []);

  return (
    <EtherscanContext.Provider value={{  currentBlock, topTenBlock, provider, gasPrice, transaction, tenBlockWithDetails, transactionDetails, getTransactionDetails, blockDetails, getBlockDetails }}>
      {children}
    </EtherscanContext.Provider>
  );
};

const RootLayoutClient: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>

    <EtherProvider>
      <div>{children}</div>
    </EtherProvider>
    </QueryClientProvider>

    </WagmiProvider>

  );
};

export { EtherscanContext, RootLayoutClient };
