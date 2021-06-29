

  import firebase from "firebase";

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAYWtjLebelMl0nsSQLEkB0ZcKQFI-IC4Q",
    authDomain: "todo-app-cc216.firebaseapp.com",
    projectId: "todo-app-cc216",
    storageBucket: "todo-app-cc216.appspot.com",
    messagingSenderId: "256434594902",
    appId: "1:256434594902:web:7acf33b8f5e498c43507f7",
    measurementId: "G-MEC2G83485"


  });

  const db = firebase.firestore();

  export default  db;
  