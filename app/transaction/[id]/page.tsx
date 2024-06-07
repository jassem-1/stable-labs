"use client";

import { useState, useEffect } from 'react';

const TransactionPage = () => {
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1]; // Get the last segment
    if (id) {
      setTransactionId(id);
      console.log("Retrieved Transaction ID:", id);
    } else {
      console.log("No Transaction ID found");
    }
  }, []);

  if (!transactionId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Transaction Hash: {transactionId}</h1>
      {/* Additional transaction details can be displayed here */}
    </div>
  );
};

export default TransactionPage;
