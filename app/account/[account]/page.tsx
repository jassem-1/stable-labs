"use client";;
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { getBalance } from 'viem/actions';
import { client } from '@/app/wagmi_config/config';

const API_ETHER_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
const API_BASE_URL = 'https://api.etherscan.io/api';

export default function AccountPage() {
  const [accountAddress, setAccountAddress] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split('/');
    const address = parts[parts.length - 1];
    if (ethers.isAddress(address)) {
        const formattedAddress = ethers.getAddress(address); // Ensure checksum address

      setAccountAddress(formattedAddress);
      fetchTransactions(formattedAddress);
      fetchBalance(formattedAddress);
    }
  }, []); 


const fetchBalance = async (address:any) => {
    if (ethers.isAddress(address)) {
        try {
            const balanceResult = await getBalance(client, {
                address: address as `0x${string}`,         
            });
            setBalance(ethers.formatEther(balanceResult.valueOf())); // Assuming the balance is in 'value' and in 'wei'
        } catch (error) {
            console.error('Error fetching balance:', error);
            setBalance('Error');
        }
    }
};


  
  const fetchTransactions = async (address:any) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}`, {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          sort: 'desc',
          apikey: API_ETHER_KEY,
        },
      });

      if (response.data.status === '1' && response.data.result) {
        setTransactions(response.data.result);
      } else {
        console.error('API Error:', response.data);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!accountAddress ? <div>Loading account details...</div> : (
        <>
          <h1>Account Details for {accountAddress}</h1>
          <p>Balance: {balance} ETH</p>
          <h3>Recent Transactions</h3>
          {isLoading ? <p>Loading transactions...</p> : (
            transactions.length > 0 ? (
              <ul>
                {transactions.map((tx :any, index:number) => (
                  <li key={index}>
                    Transaction Hash: {tx.hash} - Block Number: {tx.blockNumber}
                  </li>
                ))}
              </ul>
            ) : <p>No transactions found.</p>
          )}
        </>
      )}
    </div>
  );
}
