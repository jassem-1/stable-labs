"use client";

import { useContext } from "react";
import { EtherscanContext } from "./RootLayoutContext";

export default function Home() {
  const context = useContext(EtherscanContext);

  if (!context) {
    throw new Error("Home must be used within a EtherProvider");
  }

  const { data } = context;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-7xl text-black">      {data}
</h1>
    </main>
  );
}
