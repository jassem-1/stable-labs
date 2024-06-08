"use client";;
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getBalance } from 'viem/actions';
import { client } from '@/app/wagmi_config/config';
import axios from 'axios';



type Transaction = {
    hash: string;
  };

export default function AccountPage() {
  const [accountAddress, setAccountAddress] = useState('');
  const [transactionHashes, setTransactionHashes] = useState<string[]>([]);

/* const [transactions, setTransactions] = useState<Transaction[]>([]); 
 */const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split('/');
    const address = parts[parts.length - 1];
    if (ethers.isAddress(address)) {
        const formattedAddress = ethers.getAddress(address); // Ensure checksum address

      setAccountAddress(formattedAddress);
      fetchTransactions(formattedAddress);
/*       fetchTransactionsWagmi(formattedAddress);
 */      fetchBalance(formattedAddress);
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
      if (response.data.status === '1' && response.data.result) {
        const hashes = response.data.result.map((tx: { hash: string }) => tx.hash);
        setTransactionHashes(hashes);
      } else {
        console.error('API Error:', response.data);
        setTransactionHashes([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactionHashes([]);
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
        </>
      )}
    </div>
  );
}
