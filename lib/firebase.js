import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Load the service account key from a JSON file
const serviceAccountPath = path.resolve(process.cwd(), './jsonkeys/certamenauth-26fdf90a7715.json');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  //console.log("Service Account:", serviceAccount);
  //console.log("Project ID:", serviceAccount.project_id);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id, // Ensure the projectId is explicitly set
  });
}

const db = admin.firestore();
export { db };
