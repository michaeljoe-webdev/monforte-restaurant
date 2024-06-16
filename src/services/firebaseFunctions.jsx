import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../config/firebase.jsx';
import { getDatabase, ref, set, onValue } from "firebase/database"

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore(app);
// const auth = getAuth(app);
const db = getDatabase();

export async function addNewItem(data, path) {
  const reference = ref(db, path);
  return set(reference, data);
}

export {db}