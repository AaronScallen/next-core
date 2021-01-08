import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://fir-crud-2388f.firebaseio.com"
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}
export default admin.firestore();