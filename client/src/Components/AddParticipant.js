import React from "react";
import ButtonLogo from "../Images/AddParticipant.png";
const AddParticipant = (props) => {
  const ButtonText = <p className="buttonText">Add People</p>;
  return (
    <div className="button-container">
      {ButtonText}
      <div className="Button" onClick={props.action}>
        <img
          style={{ marginTop: "0.2vw" }}
          src={ButtonLogo}
          width="65%"
          height="90%"
        ></img>
      </div>
    </div>
  );
};

export default AddParticipant;
