// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth"; // Add this import for authentication

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const auth = getAuth(app); // Initialize and export auth



// export default app;

// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, setLogLevel } from "firebase/firestore";
import { getStorage } from "firebase/storage";  // Add this line to import Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyu02ZaMcNcXDa7dUGgC7TOKuGzea7Vas",
  authDomain: "cc3wwer.firebaseapp.com",
  projectId: "cc3wwer",
  storageBucket: "cc3wwer.firebasestorage.app",
  messagingSenderId: "279936229556",
  appId: "1:279936229556:web:ade93ad96523af676577e1",
  measurementId: "G-5NBELJHCHS"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ✅ Initialize Firestore (Force Fetch API to prevent WebChannel errors)
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });

// ✅ Initialize Firebase Storage (added this)
export const storage = getStorage(app);  // Initialize Firebase Storage

// ✅ Disable Firestore logs (Optional, if errors persist)
setLogLevel("silent");

export default app;

