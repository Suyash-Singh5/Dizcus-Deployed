import React from "react";

const AllParticipants = (props) => {
  return (
    <div
      ref={props.ParticipantsRef}
      className="chat"
      style={{ display: "none" }}
    >
      <div
        style={{
          fontSize: "2.5vh",
          textAlign: "center",
          paddingTop: "0.75vh",
          paddingBottom: "0.75vh",
          backgroundColor: "rgba(0,0,255,0.3)",
          fontFamily: "sans-serif",
          // fontWeight: "bold",
        }}
      >
        All Participants
      </div>
      <div
        ref={props.ParticipantsLogRef}
        style={{
          paddingLeft: "1vw",
          marginTop: "2vh",
          maxHeight: "75vh",
          overflow: "auto",
          fontSize: "2vh",
          // textAlign: "center",
        }}
      ></div>
    </div>
  );
};

export default AllParticipants;
