"use client";

import { ethers } from "ethers";
import { createContext, ReactNode, FC, useEffect, useState } from "react";

interface EtherscanContextProps {
  data: string;
}

const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY;

if (!infuraApiKey) {
  throw new Error("Infura API key is not defined");
}

const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${infuraApiKey}`);
const EtherscanContext = createContext<EtherscanContextProps | undefined>(undefined);

const EtherProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const data = "Etherscan Context test";
  const [currentBlock, setCurrentBlock] = useState<number[]>([]);

  const accountDetails = async () => {
    try {
      const getCurrentBlock = await provider.getBlockNumber();
      setCurrentBlock([getCurrentBlock]);

      console.log("block number is",getCurrentBlock);

      const blockTransaction = await provider.getBlock(getCurrentBlock);
      console.log("blockTransnaction is",blockTransaction);

    } catch (error) {
      console.log("Something went wrong while fetching data", error);
    }
  };
  
  useEffect(() => {
    accountDetails();
  }, []);
  

  return (
    <EtherscanContext.Provider value={{ data }}>
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
