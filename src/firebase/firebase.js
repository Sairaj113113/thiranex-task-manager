import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMc0e_6oZb1G6-FDFrmXhhLuvVLRtMi7g",
  authDomain: "thiranex-task-manager.firebaseapp.com",
  projectId: "thiranex-task-manager",
  storageBucket: "thiranex-task-manager.firebasestorage.app",
  messagingSenderId: "747836092452",
  appId: "1:747836092452:web:efa272d0f1e9436b1ae8b1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);