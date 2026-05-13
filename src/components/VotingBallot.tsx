import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs, runTransaction, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export function VotingBallot() {
  const [voter, setVoter] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!auth.currentUser?.email) return;
      const voterDoc = await getDoc(doc(db, 'voters', auth.currentUser.email));
      if (voterDoc.exists()) {
        setVoter(voterDoc.data());
        const q = query(collection(db, 'candidates'), where('schoolId', '==', voterDoc.data().schoolId));
        const candidateDocs = await getDocs(q);
        setCandidates(candidateDocs.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    }
    fetchData();
  }, []);

  const castVote = async () => {
    if (!selectedCandidate || !voter || !auth.currentUser?.email) return;

    try {
      await runTransaction(db, async (transaction) => {
        const voterRef = doc(db, 'voters', auth.currentUser!.email!);
        const ballotRef = doc(collection(db, 'ballots'));
        
        transaction.update(voterRef, { hasVoted: true });
        transaction.set(ballotRef, {
          candidateId: selectedCandidate,
          schoolId: voter.schoolId,
          timestamp: serverTimestamp()
        });
      });
      alert('Vote cast successfully!');
      setVoter({ ...voter, hasVoted: true });
    } catch (error) {
      console.error(error);
      alert('Failed to cast vote.');
    }
  };

  if (!voter) return <div>Loading...</div>;
  if (voter.hasVoted) return <div>You have already voted.</div>;

  return (
    <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Cast Your Vote</h2>
      <div className="grid grid-cols-1 gap-4">
        {candidates.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCandidate(c.id)}
            className={`w-full text-left p-5 rounded-xl border transition-all duration-200 ${
              selectedCandidate === c.id
                ? 'border-blue-600 bg-blue-50'
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
