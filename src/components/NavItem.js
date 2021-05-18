import React, { useState } from "react";

export default function NavItem(props) {
  //const [dropMenuOpen, setDropMenuOpen] = useState(false);

  return (
    <div className="nav-item">
      <a
        href="#"
        className="upper-row-button"
        onClick={() => props.setDropMenuOpen(!props.dropMenuOpen)}
      >
        {props.icon}
      </a>
      {props.dropMenuOpen && props.children}
    </div>
  );
}
