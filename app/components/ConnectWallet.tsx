import React, { useState } from 'react';
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import Web3 from 'web3'; // Ensure Web3 is installed for this to work

interface ConnectWalletButtonProps {
  buttonText?: string;
  buttonClass?: string;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  buttonText = "Connect Wallet",
  buttonClass = ""
}) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string>('');
  const [balance, setBalance] = useState<string>('');

  const onboard = Onboard({
    wallets: [injectedModule()],
    chains: [
      {
        id: '0x1',
        token: 'ETH',
        label: 'Ethereum Mainnet',
        rpcUrl: 'https://mainnet.infura.io/v3/0b289d0c1b9743e9b48a61dbc0422e55'
      },
      // Add other networks as needed
    ]
  });

  const connectWallet = async () => {
    // Initiate wallet selection and connecting process
    const wallets = await onboard.connectWallet();

    // Assuming the first wallet connected is the one we're interested in
    const wallet = wallets[0];
    if (wallet) {
      const web3Instance = new Web3(wallet.provider);
      setWeb3(web3Instance);
      const accounts = await web3Instance.eth.getAccounts();
      if (accounts.length > 0) {
        const account = accounts[0];
        setAccount(account);
        const balanceWei = await web3Instance.eth.getBalance(account);
        const balanceEth = Web3.utils.fromWei(balanceWei, 'ether');
        setBalance(balanceEth);
      }
    }
  };

  return (
    <button
      className={`px-2 py-3 bg-[#1FC7D4] w-full flex justify-center font-semibold text-white ${buttonClass}`}
      onClick={connectWallet}
    >
      {account ? `Acc: ${account.substring(0, 6)}...${account.substring(account.length - 4)}, Balance: ${balance} ETH` : buttonText}
    </button>
  );
};

export default ConnectWalletButton;
