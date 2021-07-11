import React from "react";
import Camera from "./WebcamButton";
import Mic from "./MicButton";
import CutCall from "./CutCall";
import ScreenShare from "./ScreenShare";
import Participants from "./Participants";
import EnableChat from "./EnableChat";
import AddParticipant from "./AddParticipant";
import Brand from "../Images/dizcus.png";
import fullscreen from "../Images/fullscreen.png";
import exitfullscreen from "../Images/exitfullscreen.png";

const Footer = (props) => {
  return (
    <footer className="Footer">
      <span
        className="Footer-elem"
        style={{ width: "10vw", paddingTop: "1.5vw" }}
      >
        <img src={Brand} width="75%" alt="Brand" />
      </span>
      <span
        className="Footer-elem"
        style={{ width: "3vw", paddingLeft: "0px" }}
      >
        <div ref={props.MaxScreenRef} onClick={props.FullScreenAction}>
          <div
            style={{ paddingTop: "1.5vw", cursor: "pointer" }}
            onClick={props.handleFullScreen}
          >
            <img src={fullscreen} alt="FullScreen" width="100%" />
          </div>
        </div>
        <div ref={props.MinScreenRef} onClick={props.FullScreenAction}>
          <div
            style={{ marginTop: "1.5vw", cursor: "pointer" }}
            onClick={props.exitFullScreen}
            // style={{ display: "none" }}
          >
            <img src={exitfullscreen} alt="Exit" width="60%" />
          </div>
        </div>
      </span>
      <span className="Footer-elem">
        <Camera Streaming={props.VideoStreaming} action={props.VideoAction} />
      </span>
      <span className="Footer-elem">
        <Mic Streaming={props.AudioStreaming} action={props.AudioAction} />
      </span>
      <span className="Footer-elem">
        <ScreenShare
          Streaming={props.ScreenSharing}
          action={props.ScreenShareAction}
        />
      </span>

      <span className="Footer-elem">
        <CutCall action={props.CutCallAction} />
      </span>
      <span
        className="Footer-elem"
        style={{ float: "right", marginRight: "1vw" }}
      >
        <EnableChat action={props.ChatAction} />
      </span>
      <span className="Footer-elem" style={{ float: "right" }}>
        <Participants action={props.ParticipantsAction} Count={props.Count} />
      </span>
      <span className="Footer-elem" style={{ float: "right" }}>
        <AddParticipant action={props.AddParticipantAction} />
      </span>
    </footer>
  );
};

export default Footer;
