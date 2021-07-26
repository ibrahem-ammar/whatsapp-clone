import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDsXYKbU9MUpZz0n1i56wamhq-fi3MvuXE",
    authDomain: "whatsapp-clone-f045b.firebaseapp.com",
    projectId: "whatsapp-clone-f045b",
    storageBucket: "whatsapp-clone-f045b.appspot.com",
    messagingSenderId: "218208419353",
    appId: "1:218208419353:web:223fa7187690c5937c3488"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();

const auth = app.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export { db,auth,provider };