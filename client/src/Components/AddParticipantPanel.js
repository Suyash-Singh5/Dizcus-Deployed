import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import copyLogo from "../Images/copy.png";
const AddParticipantPanel = (props) => {
  let joinLink = `dizcus.herokuapp.com/${props.roomID}/video`;
  return (
    <div
      ref={props.AddParticipantRef}
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
          //   color: "rgba(205,205,205,0.95)",
          fontFamily: "sans-serif",
          // fontWeight: "bold",
        }}
      >
        Add Participants
        <div
          style={{
            display: "inline-block",
            float: "right",
            marginRight: "1vw",
          }}
        ></div>
      </div>

      <div
        style={{
          paddingLeft: "1vw",
          marginTop: "3vh",
          maxHeight: "75vh",
          overflow: "auto",
          fontSize: "2vh",
          backgroundColor: "rgba(200,0,255,0.3)",
          paddingTop: "1vh",
          //   marginBottom: "1vh",
          //   textAlign: "center",
        }}
      >
        Joining Link:
      </div>
      <div
        style={{
          paddingLeft: "1vw",
          paddingRight: "1vw",
          //   marginTop: "1vh",
          maxHeight: "75vh",
          overflow: "auto",
          fontSize: "1.75vh",
          backgroundColor: "rgba(200,0,255,0.3)",
          paddingBottom: "2vh",
          paddingTop: "1vh",
          //   textAlign: "center",
        }}
      >
        {joinLink}
        <CopyToClipboard text={joinLink}>
          <img
            src={copyLogo}
            className="copyLogo"
            style={{ float: "right", marginTop: "2.5vh", cursor: "pointer" }}
            width="8%"
          ></img>
        </CopyToClipboard>
        <div
          className="copyText"
          style={{ position: "absolute", right: "1vw", fontSize: "1.3vh" }}
        >
          Copy
        </div>
      </div>
    </div>
  );
};

export default AddParticipantPanel;
