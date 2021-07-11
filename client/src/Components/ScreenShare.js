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
        <button onClick={props.action} className="Button Present" style={style}>
          <img
            className=""
            src={ButtonLogo}
            alt="Present Screen"
            style={{ borderRadius: "10px" }}
            width="70%"
            height="55%"
          ></img>
        </button>
      </div>
    </div>
  );
};

export default ScreenShare;
