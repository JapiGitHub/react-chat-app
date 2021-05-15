import React from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

export default function Login({ auth }) {
  const googleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <div className="loginButtContainer">
      <button onClick={googleLogin} className="googleSignButt">
        Sign in with Google ✍
      </button>
    </div>
  );
}
