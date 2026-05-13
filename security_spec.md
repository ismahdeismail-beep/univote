# Security Spec for Voting System

## 1. Data Invariants
- Voters can only be created by admins (or import tool).
- Ballot must match an existing candidate in the correct school.
- Voter can only vote once (`hasVoted` false -> true transition).
- Candidates are readable by authenticated users.

## 2. Dirty Dozen Payloads
- Ballot with non-existent candidateId.
- Ballot with wrong schoolId.
- Voter setting `hasVoted` to `true` (unauthorized user).
- Voter setting `isAuthorized` to `true` (unauthorized user).
- Ballot with `timestamp` in the future.
- Candidate update by non-admin.
- Ballot creation with `voterId` (leak).
- Ballot creation with wrong `schoolId` for the candidate.
- ... and more.

## 3. Test Runner
Will be implemented in `firestore.rules.test.ts`.
