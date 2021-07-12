import React from "react";
import ButtonLogo from "../Images/chat.png";

const EnableChat = (props) => {
  const ButtonText = <p className="buttonText">Chat</p>;
  return (
    <div>
      <div className="button-container">
        {ButtonText}
        <div className="Button" onClick={props.action}>
          <img
            style={{ marginTop: "0.4vw" }}
            src={ButtonLogo}
            width="55%"
            height="70%"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default EnableChat;
