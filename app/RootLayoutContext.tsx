"use client";;
import { ethers } from "ethers";
import { createContext, ReactNode, FC, useState } from "react";
import { Block, TransactionResponse } from "ethers";



interface EtherscanContextProps {
  data: string;
  currentBlock: number[];
  topTenBlock: number[];
  provider: ethers.JsonRpcProvider;
  gasPrice: string | null;
  transaction: Block | null;  
  tenBlockWithDetails: any[];  // Add this line for the block details array
  transactionDetails: TransactionResponse | null;
  getTransactionDetails: (txHash: string) => Promise<TransactionResponse | null>;


}

const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY;

if (!infuraApiKey) {
  throw new Error("Infura API key is not defined");
}

const provider = new ethers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${infuraApiKey}`
);
const EtherscanContext = createContext<EtherscanContextProps | undefined>(
  undefined
);

const EtherProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const data = "Etherscan Context test";

  const [currentBlock, setCurrentBlock] = useState<number[]>([]);
  const [transaction, setTransaction] = useState<Block | null>(null);

  const [topTenBlock, setTopTenBlock] = useState<number[]>([]);
  const [tenBlockWithDetails, setTenBlockWithDetails] = useState<any[]>([]);

  const [gasPrice, setGasPrice] = useState<string | null>(null);

  const [transactionDetails, setTransactionDetails] = useState<TransactionResponse | null>(null);

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



  return (
    <EtherscanContext.Provider value={{ data, currentBlock, topTenBlock, provider, gasPrice, transaction, tenBlockWithDetails, transactionDetails, getTransactionDetails }}>
      {children}
    </EtherscanContext.Provider>
  );
};

const RootLayoutClient: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <EtherProvider>
      <div>{children}</div>
    </EtherProvider>
  );
};

export { EtherscanContext, RootLayoutClient };