import React from "react";
import ButtonLogo from "../Images/ss2.png";

const ScreenShare = (props) => {
  let style = {};
  if (props.Streaming) {
    style = {
      backgroundColor: "blue",
      border: "0px",
    };
  }
  let ButtonText = <p className="buttonText">Present</p>;
  return (
    <div>
      <div className="button-container">
        {ButtonText}
        <div onClick={props.action} className="Button Present" style={style}>
          <img
            src={ButtonLogo}
            alt="Present Screen"
            style={{ borderRadius: "10px", marginTop: "0.5vw" }}
            width="60%"
            height="55%"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default ScreenShare;
