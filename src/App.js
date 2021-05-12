import "./App.css";
import { useState, useRef, useEffect } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

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
    "Firebase App named '[DEFAULT]' already exists, ERROR OHITETTU try catchilla."
  );
}

const auth = firebase.auth();
const firestore = firebase.firestore();

//DEBUG
auth.signOut();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <section>{user ? <Chat /> : <Login />}</section>
    </div>
  );
}

function Login() {
  const googleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <div>
      <button onClick={googleLogin} className="googleSignButt">
        Sign in with Google ✍
      </button>
    </div>
  );
}

function Logout() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Logout
      </button>
    )
  );
}

function Chat() {
  //reference a firestore collection
  const messagesRef = firestore.collection("messages");

  const query = messagesRef.orderBy("createdAt").limit(25);

  //hookki jotta react päivittelee messagessin muuttuessa
  //idField: (optional) name of the field that should be populated with the firebase.firestore.QuerySnapshot.id property
  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const scrollDownRef = useRef();

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
  };

  //scrollaa alas kirjautumisen jälkeen ja aina kun uusi viesti tulee.
  useEffect(() => {
    scrollDownRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <>
      <main className="chat">
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={scrollDownRef}> </span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => {
            setFormValue(e.target.value);
          }}
        />
        <button type="submit">Send 💬</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt={uid} />
      <p>{text}</p>
    </div>
  );
}

export default App;
