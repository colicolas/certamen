import bcrypt from 'bcryptjs';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = require('../jsonkeys/certamenauth-26fdf90a7715.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const verifyGoogleToken = async (idToken) => {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  return decodedToken;
};

// Example of an authentication function, adjust as necessary
export const checkAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  admin.auth().verifyIdToken(token)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      console.error('Error verifying token:', error);
      return res.status(401).send('Unauthorized');
    });
};

/*import admin from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';

export const verifyGoogleToken = async (idToken: string) => {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  return decodedToken;
};

// Example of an authentication function, adjust as necessary
export const checkAuth = (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  admin.auth().verifyIdToken(token)
    .then((decodedToken) => {
      req.user = decodedToken;
      return next();
    })
    .catch((error) => {
      console.error('Error verifying token:', error);
      return res.status(401).send('Unauthorized');
    });
};*/
