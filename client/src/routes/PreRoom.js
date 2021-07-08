import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import CamOn from "../Images/CamOn.png";
import CamOff from "../Images/CamOff.png";
import MicOn from "../Images/MicOn.png";
import MicOff from "../Images/MicOff.png";
import { Link, useRouteMatch } from "react-router-dom";

const VideoBox = styled.video`
  // height: 45vh;
  width: 35vw;
  border: 1px solid blue;
  border-radius: 10px;
  margin-left: 15vw;
  margin-top: 20vh;
`;

const name = {
  position: "absolute",
  fontSize: "2.2vw",
  top: "25vh",
  left: "55vw",
  width: "30vw",
  backgroundColor: "rgba(255,0,255,0.3)",
  color: "white",
  border: "2px solid purple",
  borderRadius: "10px",
  textAlign: "center",
  fontFamily: "times-new-roman",
};

const micstyle = {
  position: "absolute",
  left: "63vw",
  marginTop: "40vh",
  color: "white",
  // border: "none",
  width: "4.5vw",
  height: "3.5vw",
};

const camstyle = {
  position: "absolute",
  left: "73vw",
  marginTop: "40vh",
  color: "white",
  // border: "none",
  width: "4.5vw",
  height: "3.5vw",
};

const joinstyle = {
  position: "absolute",
  left: "67vw",
  marginTop: "55vh",
  color: "white",
  backgroundColor: "green",
  width: "8vw",
  height: "4vw",
  fontSize: "2vw",
  borderRadius: "2vh",
  border: "none",
  fontFamily: "sans-serif",
};

const PreRoom = (props) => {
  let match = useRouteMatch();
  const userVid = useRef();
  const nameRef = useRef();
  const [VideoStreaming, setVideoStreaming] = useState(true);
  const [AudioStreaming, setAudioStreaming] = useState(true);
  const [nameValue, setnameValue] = useState(null);
  let camButton = null;
  let micButton = null;

  if (VideoStreaming) {
    camButton = <img src={CamOn} alt="" width="55%" height="75%" />;
  } else {
    camButton = <img src={CamOff} alt="" width="55%" height="80%" />;
  }
  if (AudioStreaming) {
    micButton = <img src={MicOn} alt="" width="55%" height="75%" />;
  } else {
    micButton = <img src={MicOff} alt="" width="55%" height="75%" />;
  }

  useEffect(() => {
    dispVideoBox();
  }, []);

  const toggleAudio = () => {
    userVid.current.srcObject.getAudioTracks()[0].enabled =
      !userVid.current.srcObject.getAudioTracks()[0].enabled;
    setAudioStreaming(!AudioStreaming);
  };

  const toggleVideo = () => {
    userVid.current.srcObject.getVideoTracks()[0].enabled =
      !userVid.current.srcObject.getVideoTracks()[0].enabled;
    setVideoStreaming(!VideoStreaming);
  };

  const dispVideoBox = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVid.current.srcObject = stream;
        userVid.current.srcObject.getVideoTracks()[0].enabled = VideoStreaming;
        userVid.current.srcObject.getAudioTracks()[0].enabled = AudioStreaming;
      });
  };

  const handleJoin = () => {
    if (userVid.current.srcObject) {
      userVid.current.srcObject.getAudioTracks()[0].stop();
    }
    if (userVid.current.srcObject) {
      userVid.current.srcObject.getVideoTracks()[0].stop();
    }
  };

  const handleName = () => {
    setnameValue(nameRef.current.value);
  };

  return (
    <div className="bg">
      <div
        style={{
          position: "absolute",
          top: "6vh",
          left: "16vw",
          color: "yellow",
          fontSize: "2vw",
          fontFamily: "sans-serif",
          fontStyle: "italic",
          backgroundColor: "rgba(255,0,255,0.15)",
          padding: "0.5vw 1.5vw 0.5vw 1.5vw",
          borderRadius: "1vw",
        }}
      >
        Smile! It increases your face value
      </div>
      <VideoBox ref={userVid} autoPlay muted playsInline />
      <input
        ref={nameRef}
        style={name}
        placeholder="Enter your Name..."
        onChange={handleName}
      ></input>
      <button style={micstyle} onClick={toggleAudio} className="Button">
        {micButton}
      </button>
      <button style={camstyle} onClick={toggleVideo} className="Button">
        {camButton}
      </button>
      <Link
        to={{
          pathname: `${match.url}/join`,
          state: {
            video: VideoStreaming,
            audio: AudioStreaming,
            name: nameValue,
          },
        }}
      >
        <button style={joinstyle} onClick={handleJoin}>
          Join
        </button>
      </Link>
    </div>
  );
};

export default PreRoom;
