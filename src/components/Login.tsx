import { useState } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '../firebase';

export function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleLogin = async () => {
    try {
      const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setSent(true);
    } catch (error) {
      console.error(error);
      alert('Error sending email link.');
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">University Voting</h1>
      {sent ? (
        <p className="text-gray-600 text-sm leading-relaxed">Check your email for the secure login link.</p>
      ) : (
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
      )}
    </div>
  );
}
