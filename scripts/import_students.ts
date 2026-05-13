import * as admin from 'firebase-admin';

// Initialize with application default credentials
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

async function importStudents(tenantId: string, students: { email: string, schoolId: string }[]) {
  const batch = db.batch();
  for (const student of students) {
    // 1. Create Auth User
    try {
      await admin.auth().createUser({
        email: student.email,
        emailVerified: false, 
      });
      console.log(`Created Auth user: ${student.email}`);
    } catch (e) {
      console.error(`Error creating Auth user: ${student.email}`, e);
    }
    
    // 2. Set Voter Data
    const voterRef = db.collection('voters').doc(student.email);
    batch.set(voterRef, {
      tenantId, // Add tenantId
      schoolId: student.schoolId,
      hasVoted: false,
      isAuthorized: true
    });
  }
  await batch.commit();
  console.log('Batch import completed.');
}

// Example usage
const students = [
  { email: 'student1@engineering.univ.edu', schoolId: 'engineering' },
  { email: 'student2@business.univ.edu', schoolId: 'business' }
];

importStudents('tenant123', students).catch(console.error);
