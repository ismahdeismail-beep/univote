/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from './firebase';
import { Login } from './components/Login';
import { VotingBallot } from './components/VotingBallot';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
      } else {
        // Check if email link sign in
        if (isSignInWithEmailLink(auth, window.location.href)) {
          let email = window.localStorage.getItem('emailForSignIn');
          if (!email) {
            email = window.prompt('Please provide your email for confirmation');
          }
          await signInWithEmailLink(auth, email!, window.location.href);
          window.localStorage.removeItem('emailForSignIn');
        }
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {user ? <VotingBallot /> : <Login />}
    </div>
  );
}
