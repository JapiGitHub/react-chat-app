import React from "react";

export default function Logout({ auth }) {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Logout
      </button>
    )
  );
}
