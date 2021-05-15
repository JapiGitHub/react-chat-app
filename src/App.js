import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";

import Login from "./components/Login";
import Chat from "./components/Chat";

//DEFAULT already exits, mut nyt valittaa ReferenceError: Cannot access 'messages' before initialization
try {
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId,
  });
} catch {
  console.log(
    "ei varsinainen errori,mutta Firebase App named '[DEFAULT]' already exists, ERROR OHITETTU try catchilla."
  );
}

const auth = firebase.auth();
const firestore = firebase.firestore();

//DEBUGgia varten
auth.signOut();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <section>
        {user ? (
          <Chat auth={auth} firestore={firestore} />
        ) : (
          <Login auth={auth} />
        )}
      </section>
    </div>
  );
}

export default App;
