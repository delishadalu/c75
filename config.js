// Import the functions you need from the SDKs you need
import firebase from "firebase"
require('@firebase/firestore')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqg4dq7UwjPgQcMycmlf0fwBtqxmuwuCc",
  authDomain: "willy-app-893e9.firebaseapp.com",
  projectId: "willy-app-893e9",
  storageBucket: "willy-app-893e9.appspot.com",
  messagingSenderId: "373163488902",
  appId: "1:373163488902:web:458504e661cb169f18c307"
};

// Initialize Firebase
if(!firebase.apps.length)
firebase.initializeApp(firebaseConfig);
export default firebase.firestore()