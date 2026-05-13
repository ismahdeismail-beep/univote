import { useState, useMemo } from 'react';
import { voters, candidates } from '../data';

export function VotingBallot({ user }: { user: { email: string } }) {
  const voter = useMemo(() => voters.find(v => v.email === user.email), [user.email]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  const hasVoted = useMemo(() => {
    const voted = localStorage.getItem(`voted_${user.email}`);
    return !!voted;
  }, [user.email]);

  const schoolCandidates = useMemo(() => {
    if (!voter) return [];
    return candidates.filter(c => c.schoolId === voter.schoolId);
  }, [voter]);

  const castVote = () => {
    if (!selectedCandidate) return;
    localStorage.setItem(`voted_${user.email}`, selectedCandidate);
    alert('Vote cast successfully!');
    window.location.reload(); // Refresh to update view
  };

  if (!voter) return <div className="text-center p-10 text-gray-500">User not authorized.</div>;
  if (hasVoted) return (
    <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold text-gray-900">Thank you!</h2>
      <p className="text-gray-600 mt-2">You have already participated in this election.</p>
    </div>
  );

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-lg mx-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Cast Your Vote</h2>
      <div className="grid grid-cols-1 gap-4">
        {schoolCandidates.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCandidate(c.id)}
            className={`w-full text-left p-5 rounded-xl border transition-all duration-200 ${
              selectedCandidate === c.id
                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-opacity-20'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <p className="font-bold text-gray-900">{c.name}</p>
            <p className="text-sm text-gray-500 mt-0.5">{c.position}</p>
          </button>
        ))}
      </div>
      <button
        onClick={castVote}
        disabled={!selectedCandidate}
        className="w-full mt-8 bg-blue-900 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cast Vote
      </button>
    </div>
  );
}
