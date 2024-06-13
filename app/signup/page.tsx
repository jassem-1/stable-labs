"use client"
import { useState } from 'react';
import { signup } from './actions';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [notification, setNotification] = useState<string>('');


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await signup(email, password, username);
    if (response.error) {
      setNotification('Failed to sign up. Please try again.');
    } else {
      setNotification('We sent an email to your email. Please verify to continue.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
    <div className="w-full max-w-md p-8 space-y-3 bg-black bg-opacity-30 text-white rounded-lg shadow-lg blur-background">
      <h1 className="text-xl font-semibold text-center">Sign Up</h1>
      <form onSubmit={handleSignup}
      
       className="space-y-6 flex flex-col justify-center ">
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email:</label>
          <input id="email" type="email" required onChange={(e) => setEmail(e.target.value)}
                 className="w-full bg-transparent px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="username" className="text-sm font-medium">Username:</label>
          <input id="username" type="text" required onChange={(e) => setUsername(e.target.value)}
                 className="w-full px-3 py-2 bg-transparent  border rounded-md" />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium">Password:</label>
          <input id="password" type="password" required onChange={(e) => setPassword(e.target.value)}
                 className="w-full px-3 py-2 bg-transparent  border rounded-md" />
        </div>
        <button type="submit" className="w-1/3 px-6 py-2 text-[#0ff] bg-transparent border border-[#0ff] rounded-md hover:bg-white hover:bg-opacity-25">Sign up</button>
      </form>
      {notification && <p className="text-center text-sm text-red-500">{notification}</p>}

      <p className="text-center">Already have an account? <Link href="/login" className="text-[#0ff] hover:underline">Log in</Link></p>
    </div>
  </div>
  )
}
