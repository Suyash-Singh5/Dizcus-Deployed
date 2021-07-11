import React from "react";
import MicOn from "../Images/MicOn.png";
import MicOff from "../Images/MicOff.png";
import "../Room.css";

export const MicButton = (props) => {
  let ButtonLogo = null;
  let ButtonText = null;
  if (!props.Streaming) {
    ButtonLogo = (
      <img
        src={MicOff}
        alt=""
        width="45%"
        height="70%"
        style={{
          marginTop: "0.3vw",
        }}
      />
    );
    ButtonText = <p className="buttonText">Mic On</p>;
  } else {
    ButtonLogo = (
      <img
        src={MicOn}
        alt="On"
        width="35%"
        height="70%"
        style={{
          marginTop: "0.3vw",
        }}
      />
    );
    ButtonText = <p className="buttonText">Mic Off</p>;
  }
  return (
    <div>
      <div className="button-container">
        {ButtonText}
        <div className="Button" onClick={props.action}>
          {ButtonLogo}
        </div>
      </div>
    </div>
  );
};

export default MicButton;
