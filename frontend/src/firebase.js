import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJ9gVpNNNpOLsHFWZ7jv4o5ohCnq9_ayg",
  authDomain: "quizwiz-8a3db.firebaseapp.com",
  projectId: "quizwiz-8a3db",
  storageBucket: "quizwiz-8a3db.appspot.com",
  messagingSenderId: "488003700412",
  appId: "1:488003700412:web:8470a7cba05a2115d932b9",
  measurementId: "G-MX7JDN0FE1"
};

const app = initializeApp(firebaseConfig);
const Auth = getAuth(app);

export { Auth };