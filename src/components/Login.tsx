import { useState } from 'react';
import { voters } from '../data';

export function Login({ onLogin }: { onLogin: (user: { email: string }) => void }) {
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    const voter = voters.find(v => v.email === email);
    if (voter) {
      const userData = { email: voter.email };
      localStorage.setItem('voting_session', JSON.stringify(userData));
      onLogin(userData);
    } else {
      alert('Email not authorized.');
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">University Voting</h1>
      <div className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="university email"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
        />
        <button onClick={handleLogin} className="w-full bg-blue-900 text-white font-semibold text-sm py-3 px-4 rounded-xl hover:bg-blue-800 transition-colors shadow-sm">
          Continue
        </button>
      </div>
    </div>
  );
}
