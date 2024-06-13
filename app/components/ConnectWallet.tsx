import React, { useState } from 'react';
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import Web3 from 'web3'; // Ensure Web3 is installed for this to work

interface ConnectWalletButtonProps {
  buttonText?: string;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  buttonText = "Connect Wallet",
}) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);


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
    if (!account) {  // only connect if no account is not connected
      const wallets = await onboard.connectWallet();
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
    }
  };
  const handleMouseEnter = () => {
    if (account) { 
      setIsModalVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsModalVisible(false);
  };
  return (
    <div>
      <button
      className="px-2 py-1 flex justify-center hover:border hover:border-white font-semibold text-white text-sm hover:bg-transparent rounded-full "
      onClick={connectWallet}
      onMouseEnter={(handleMouseEnter)}
      onMouseLeave={handleMouseLeave}
    >
      {account ? `Acc: ${account.substring(0, 6)}...${account.substring(account.length - 4)}, Balance: ${balance} ETH` : buttonText}
    </button>
    {isModalVisible && account && (
        <div className="absolute flex flex-col justify-center items-start break-words bg-black bg-opacity-45 border border-black rounded-2xl p-3 w-52 " >
          <p className="break-all">Account: {account}</p>
          <p>Balance: {balance} ETH</p>
        </div>
      )}
    </div>
  
  );
};

export default ConnectWalletButton;
