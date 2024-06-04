import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Load the service account key from a JSON file
//const serviceAccountPath = path.resolve(process.cwd(), './jsonkeys/certamenauth-26fdf90a7715.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    }),
    databaseURL: "https://certamenauth.firebaseio.com"
  });
}

/*if (!admin.apps.length) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  //console.log("Service Account:", serviceAccount);
  //console.log("Project ID:", serviceAccount.project_id);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID, // Ensure the projectId is explicitly set
  });
}*/

const db = admin.firestore();
export { db };
