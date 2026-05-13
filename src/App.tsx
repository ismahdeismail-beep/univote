/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { VotingBallot } from './components/VotingBallot';

export default function App() {
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('voting_session');
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('voting_session');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {user ? (
        <div className="w-full">
          <button onClick={handleLogout} className="absolute top-4 right-4 text-sm text-gray-500">Sign Out</button>
          <VotingBallot user={user} />
        </div>
      ) : (
        <Login onLogin={setUser} />
      )}
    </div>
  );
}
