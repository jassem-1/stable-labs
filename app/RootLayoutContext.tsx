"use client";

import { createContext, ReactNode, FC } from "react";

interface EtherscanContextProps {
  data: string;
}

const EtherscanContext = createContext<EtherscanContextProps | undefined>(undefined);

const EtherProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const data = "Etherscan Context test";

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
