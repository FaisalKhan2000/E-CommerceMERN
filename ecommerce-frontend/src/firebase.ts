import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyD90Lm8o2qWS3KvjTDc1jtIffR7inc-fPo",
//   authDomain: "ecommerce-6aac8.firebaseapp.com",
//   projectId: "ecommerce-6aac8",
//   storageBucket: "ecommerce-6aac8.appspot.com",
//   messagingSenderId: "36566237205",
//   appId: "1:36566237205:web:aa78afd27468be38368e1c",
//   measurementId: "G-Y3LP0CFNWT",
// };

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
