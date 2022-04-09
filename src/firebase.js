import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword,updateProfile,signInWithEmailAndPassword,signInWithPopup, GoogleAuthProvider,signOut} from "firebase/auth";
import { getDatabase, ref, set,push,child,onValue,onChildAdded, onChildChanged,onChildRemoved } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC7JYfPdBaPc0psAYIOeIZy7shKffnsqeI",
  authDomain: "sujanchatboot.firebaseapp.com",
  projectId: "sujanchatboot",
  storageBucket: "sujanchatboot.appspot.com",
  messagingSenderId: "130323472249",
  appId: "1:130323472249:web:f999f09fa54a217fc759a8"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export {getAuth, createUserWithEmailAndPassword,updateProfile,signInWithEmailAndPassword,signInWithPopup, GoogleAuthProvider,signOut,getDatabase, ref, push, set,onValue,child,onChildAdded, onChildChanged,onChildRemoved,storage}