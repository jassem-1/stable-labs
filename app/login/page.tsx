"use client";
import { useState } from 'react';
import { login } from './actions';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);

  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
    <div className="w-full max-w-md  p-8 space-y-3  bg-black bg-opacity-30 text-white rounded-lg shadow-lg blur-background">
      <h1 className="text-xl font-semibold text-center">Log In</h1>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email:</label>
          <input id="email" type="email" required onChange={(e) => setEmail(e.target.value)}
                 className="w-full bg-transparent px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium">Password:</label>
          <input id="password" type="password" required onChange={(e) => setPassword(e.target.value)}
                 className="w-full bg-transparent px-3 py-2 border rounded-md" />
        </div>
        <button type="submit" className="px-6 py-2  text-[#0ff] bg-transparent border border-[#0ff] rounded-md hover:bg-white hover:bg-opacity-25">Log in</button>
      </form>
      <p className="text-center">Don't have an account? <Link href="/signup" className="text-[#0ff] hover:underline">Sign up</Link></p>
    </div>
  </div>
  )
}
