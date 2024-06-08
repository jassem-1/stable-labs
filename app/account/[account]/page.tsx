"use client";

import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { ethers } from 'ethers';
import axios from 'axios';

const API_ETHER_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
const API_BASE_URL = 'https://api.etherscan.io/api';

export default function AccountPage() {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({
    address, // This line requires `address` to be correctly formatted.
  });
  const [accountAddress, setAccountAddress] = useState('');
  const [transactions, setTransactions] = useState([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split('/');
    const address = parts[parts.length - 1];
    if (ethers.isAddress(address)) {
      setAccountAddress(address);
      fetchTransactions(address);
    }
  }, []);

  const fetchTransactions = async (address: any) => {
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

      // Check for successful response and valid data structure
      if (response.data.status === '1' && response.data.result) {
        setTransactions(response.data.result); // Update with actual transactions
      } else {
        console.error('API Error:', response.data); // Handle potential errors
      }
    } catch (error) {
      console.error('Error fetching transactions:', error); // Handle fetch errors
    } finally {
      setIsLoading(false); // Always set loading state to false after fetching
    }
  };

  // Conditional rendering based on transaction availability
  return (
    <div>
      {!accountAddress && <div>Loading account details...</div>}
      {accountAddress && (
        <>
          <h1>Account Details for {accountAddress}</h1>
          <p>Balance: {balanceData?.value.toString() ?? '0'} ETH</p>
          <h3>Recent Transactions</h3>
          {isLoading ? (
            <p>Loading transactions...</p>
          ) : (
            transactions.length > 0 ? (
              <ul>
                {transactions.map((tx: any, index: number) => (
                  <li key={index}>
                    Transaction Hash: {tx.hash} - Block Number: {tx.blockNumber}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No transactions found.</p>
            )
          )}
        </>
      )}
    </div>
  );
}
