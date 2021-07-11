import React from "react";
import ButtonLogo from "../Images/people.png";

const Participants = (props) => {
  let ButtonText = null;
  ButtonText = <div className="buttonText">People</div>;
  return (
    // <div>
    <div className="button-container">
      {ButtonText}
      <div
        onClick={props.action}
        className="Button"
        style={{ color: "white", fontSize: "1vw" }}
      >
        <img
          src={ButtonLogo}
          alt="Participants"
          style={{ marginTop: "0.6vw" }}
          width="60%"
          height="70%"
        ></img>
        {props.Count}
      </div>
    </div>
    // </div>
  );
};

export default Participants;
