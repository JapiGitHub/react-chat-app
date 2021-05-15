import React from "react";

export default function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === props.auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img className="avatarPic" src={photoURL} alt={uid} />
      <p>{text}</p>
    </div>
  );
}
