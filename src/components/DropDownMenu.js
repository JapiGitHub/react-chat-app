import React, { useState, useRef, useEffect } from "react";
import { CSSTransition } from "react-transition-group";

export default function DropDownMenu({ setFormValue, formValue, auth }) {
  const [activeMenu, setActiveMenu] = useState("emojis");
  const [menuHeight, setMenuHeight] = useState();
  const dropdownRef = useRef(null);

  useEffect(() => {
    //+22 pitää olla tossa jotta ekalla kerralla toi menee oikein
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight + 22);
  }, []);

  function calcHeight(el) {
    //ajetaan CSSTransitionin onEnter lifecyclessä.

    //DOM elements actual pixelheight
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropDownItem(props) {
    return (
      <a
        href="#"
        className="dropdown-menu-item menu-text-button"
        onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
      >
        <span className="icon-left">
          {props.leftIcon}
          {props.children}
        </span>

        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  function DropDownEmoji(props) {
    return (
      <a
        href="#"
        className="dropdown-menu-item emoji"
        onClick={() => setFormValue(`${formValue}${props.EmojiIcon}`)}
      >
        {props.EmojiIcon}
      </a>
    );
  }

  return (
    <div
      className="dropdown-menu"
      style={{ height: menuHeight }}
      ref={dropdownRef}
    >
      <CSSTransition
        in={activeMenu === "emojis"}
        unmountOnExit
        timeout={500}
        classNames="menu-primary-transition"
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropDownItem leftIcon="🚪" goToMenu="logout">
            Logout
          </DropDownItem>

          <div className="emoji-grid">
            <DropDownEmoji EmojiIcon="😃" />
            <DropDownEmoji EmojiIcon="😆" />
            <DropDownEmoji EmojiIcon="🤣" />
            <DropDownEmoji EmojiIcon="😅" />
            <DropDownEmoji EmojiIcon="😍" />
            <DropDownEmoji EmojiIcon="🤩" />
            <DropDownEmoji EmojiIcon="🤔" />
            <DropDownEmoji EmojiIcon="😬" />
            <DropDownEmoji EmojiIcon="🤕" />
            <DropDownEmoji EmojiIcon="😎" />
            <DropDownEmoji EmojiIcon="🤯" />
            <DropDownEmoji EmojiIcon="😱" />
            <DropDownEmoji EmojiIcon="👍" />
            <DropDownEmoji EmojiIcon="🏆" />
            <DropDownEmoji EmojiIcon="🎰" />
            <DropDownEmoji EmojiIcon="💀" />
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === "logout"}
        unmountOnExit
        timeout={500}
        classNames="menu-secondary-transition"
        onEnter={calcHeight}
      >
        <div className="menu">
          <div onClick={() => auth.signOut()}>
            <DropDownItem>🚪 Yes, Logout</DropDownItem>
          </div>

          <DropDownItem goToMenu="emojis">Not yet!</DropDownItem>
        </div>
      </CSSTransition>
    </div>
  );
}
