import React from "react";
import CamOn from "../Images/CamOn.png";
import CamOff from "../Images/CamOff.png";
export const WebcamButton = (props) => {
  let ButtonLogo = null;
  let ButtonText = null;
  if (!props.Streaming) {
    ButtonLogo = (
      <img
        src={CamOff}
        alt="Off"
        width="55%"
        height="55%"
        style={{
          marginTop: "0.5vw",
        }}
      />
    );
    ButtonText = <p className="buttonText">Camera On</p>;
  } else {
    ButtonLogo = (
      <img
        src={CamOn}
        alt="On"
        width="55%"
        height="55%"
        style={{
          marginTop: "0.5vw",
        }}
      />
    );
    ButtonText = <p className="buttonText">Camera Off</p>;
  }

  return (
    <div style={{ marginLeft: "20vw" }}>
      <div className="button-container">
        {ButtonText}
        <div id="webcamButton" onClick={props.action} className="Button">
          {ButtonLogo}
        </div>
      </div>
    </div>
  );
};

export default WebcamButton;
