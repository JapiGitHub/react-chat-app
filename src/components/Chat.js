import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "./menu.css";

import ChatMessage from "./ChatMessage";
import NavItem from "./NavItem";
import DropDownMenu from "./DropDownMenu";

export default function Chat({ auth, firestore }) {
  //reference a firestore collection
  const messagesRef = firestore.collection("messages");

  const query = messagesRef.orderBy("createdAt");

  //hookki jotta react päivittelee messagessin muuttuessa
  //idField: (optional) name of the field that should be populated with the firebase.firestore.QuerySnapshot.id property
  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const scrollDownRef = useRef();

  const [dropMenuOpen, setDropMenuOpen] = useState(false);

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

  const pressEnterHandler = (e) => {
    if (e.key == "Enter") {
      sendMessage(e);
    }
  };

  //scrollaa viestit alas kirjautumisen jälkeen JA aina kun uusi viesti tulee.
  useEffect(() => {
    scrollDownRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <>
      <NavItem
        icon="😀"
        dropMenuOpen={dropMenuOpen}
        setDropMenuOpen={setDropMenuOpen}
      >
        <DropDownMenu
          setFormValue={setFormValue}
          formValue={formValue}
          auth={auth}
        />
      </NavItem>
      <main className="chat" onClick={() => setDropMenuOpen(false)}>
        {messages &&
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} auth={auth} />
          ))}

        <nav ref={scrollDownRef}> </nav>
      </main>

      <form className="footerContainer" onSubmit={sendMessage}>
        <textarea
          className="textarea-message-input"
          rows="4"
          autoFocus
          maxLength="1024"
          value={formValue}
          onChange={(e) => {
            setFormValue(e.target.value);
          }}
          onKeyPress={(e) => pressEnterHandler(e)}
        />
        <button className="sendButton" type="submit">
          Send&nbsp;💬
        </button>
      </form>
    </>
  );
}
