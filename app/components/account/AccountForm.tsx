import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

const AccountForm: React.FC = () => {
  const router = useRouter();
  const [userAccount, setUserAccount] = useState<string>('');

  const handleAccountSubmit = (event: FormEvent) => {
    event.preventDefault();
    const address = userAccount.trim();
    if (address) {
      router.push(`/account?address=${address}`);
      setUserAccount(''); // Clear the input after submitting
    } else {
      console.error("No address provided");
    }
  };

  return (
    <form onSubmit={handleAccountSubmit} className='flex flex-col space-y-4 bg-gray-100 p-5'>
      <input
        type="text"
        placeholder="Ether Account address"
        value={userAccount}
        onChange={(e) => setUserAccount(e.target.value)}
        className='p-2 border border-gray-300 rounded'
      />
      <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
        Connect Wallet
      </button>
    </form>
  );
};

export default AccountForm;
