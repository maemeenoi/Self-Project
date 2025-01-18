import { initializeApp, getApps } from "firebase/app"
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"
import { getFirestore, initializeFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
let firebaseApp
let auth
let db

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig)
  auth = getAuth(firebaseApp)
  // Set persistence to LOCAL
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("Firebase persistence set to LOCAL")
    })
    .catch((error) => {
      console.error("Error setting persistence:", error)
    })

  // Initialize Firestore with settings
  db = initializeFirestore(firebaseApp, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
  })
} else {
  firebaseApp = getApps()[0]
  auth = getAuth(firebaseApp)
  db = getFirestore(firebaseApp)
}

export { auth, db }
