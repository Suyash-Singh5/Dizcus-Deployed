import React from "react";
import ButtonLogo from "../Images/AddParticipant.png";
const AddParticipant = (props) => {
  const ButtonText = <p className="buttonText">Add People</p>;
  return (
    <div className="button-container">
      {ButtonText}
      <button className="Button" onClick={props.action}>
        <img src={ButtonLogo} width="85%" height="100%"></img>
      </button>
    </div>
  );
};

export default AddParticipant;
