import React from "react";
import ButtonLogo from "../Images/chat.png";

const EnableChat = (props) => {
  const ButtonText = <p className="buttonText">Chat</p>;
  return (
    <div>
      <div className="button-container">
        {ButtonText}
        <button className="Button" onClick={props.action}>
          <img src={ButtonLogo} width="85%" height="100%"></img>
        </button>
      </div>
    </div>
  );
};

export default EnableChat;
