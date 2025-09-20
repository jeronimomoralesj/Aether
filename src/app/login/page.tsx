'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Dummy login: just redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="max-w-md w-full bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl border border-white/20">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Login
        </h1>

        <div className="mb-4">
          <label className="block mb-1 text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-white/20 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-white/20 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="********"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105"
        >
          Login
        </button>
      </div>
    </div>
  );
}
