import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "./ChatMessage";

export default function Chat({ auth, firestore }) {
  //reference a firestore collection
  const messagesRef = firestore.collection("messages");

  const query = messagesRef.orderBy("createdAt");

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
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} auth={auth} />
          ))}

        <nav ref={scrollDownRef}> </nav>
      </main>

      <form className="footerContainer" onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => {
            setFormValue(e.target.value);
          }}
        />
        <button className="sendButton" type="submit">
          Send&nbsp;💬
        </button>
      </form>
    </>
  );
}
