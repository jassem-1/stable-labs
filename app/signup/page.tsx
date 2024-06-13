"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();
    const supabase = createClientComponentClient();
    const [message, setMessage] = useState('');

    const handleSignUp = async () => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`
            }
        });
        if (error) {
            console.error('Signup error:', error.message);
            setMessage(error.message); 

        } else {
          setMessage('A verification email has been sent. Please check your email.');

          setTimeout(() => {
            router.push('/login'); 
        }, 5000);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-transparent">
            <div className="w-full max-w-md  p-8 space-y-3  bg-black bg-opacity-30 text-white rounded-lg shadow-lg blur-background">
            <h1 className="text-xl font-semibold text-center">Sign up</h1>

                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-transparent px-3 py-2 border rounded-md"
                />
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-transparent px-3 py-2 border rounded-md"
                />
                <button 
                    onClick={handleSignUp}
                    className="px-6 py-2  text-[#0ff] bg-transparent border border-[#0ff] rounded-md hover:bg-white hover:bg-opacity-25"                >
                    Sign Up
                </button>
                <p className="text-center">Already have an account? <Link href="/login" className="text-[#0ff] hover:underline">login</Link></p>
                {message && <p className="mt-4 p-3 bg-black bg-opacity-45 text-center text-white">{message}</p>} 


            </div>
        </div>
    );
}
