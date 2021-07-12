import React from "react";
import ButtonLogo from "../Images/CutCall.png";
import "../Room.css";
import { Link } from "react-router-dom";
export const CutCall = (props) => {
  let ButtonText = null;
  ButtonText = <p className="buttonText">Leave Call</p>;
  return (
    <div>
      <div className="button-container">
        {ButtonText}
        <div onClick={props.action} className="Button CutCall">
          <img
            className="CutCall"
            style={{ borderRadius: "100px", marginTop: "0.5vw" }}
            src={ButtonLogo}
            alt="Leave Call"
            width="65%"
            height="50%"
          />
        </div>
      </div>
    </div>
  );
};
export default CutCall;
