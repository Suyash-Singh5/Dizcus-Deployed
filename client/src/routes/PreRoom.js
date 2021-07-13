import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import CamOn from "../Images/CamOn.png";
import CamOff from "../Images/CamOff.png";
import MicOn from "../Images/MicOn.png";
import MicOff from "../Images/MicOff.png";
import { Link, useRouteMatch } from "react-router-dom";

// Styled Video Box Component

const VideoBox = styled.video`
  width: 35vw;
  border: 1px solid blue;
  border-radius: 10px;
  margin-left: 15vw;
  margin-top: 20vh;
`;

// Enter name input field styling

const name = {
  position: "absolute",
  fontSize: "2.2vw",
  top: "25vh",
  left: "55vw",
  width: "30vw",
  backgroundColor: "rgba(255,0,255,0.3)",
  color: "white",
  border: "0.2vw solid purple",
  borderRadius: "10px",
  textAlign: "center",
};

// Mic button styling

const micstyle = {
  display: "inline-block",
  position: "absolute",
  left: "63vw",
  marginTop: "40vh",
  color: "white",
  width: "4.5vw",
  height: "3.5vw",
};

// Camera button styling

const camstyle = {
  display: "inline-block",
  position: "absolute",
  left: "73vw",
  marginTop: "40vh",
  color: "white",
  width: "4.5vw",
  height: "3.5vw",
};

// Join button styling

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
};

/* Main functional component which is responsible for the page which appears before joining 
   It takes state variable like username and chat logs if passed from the chat room */

const PreRoom = (props) => {
  // Initializing Variables

  let match = useRouteMatch();
  const userVid = useRef(); // Refers to Video Box element
  const nameRef = useRef(); // Refers to Input element which stores the username
  const [VideoStreaming, setVideoStreaming] = useState(true); // Stores state of Video button (on/off)
  const [AudioStreaming, setAudioStreaming] = useState(true); // Stores state of Audio button (on/off)
  const [nameValue, setnameValue] = useState(null); // Stores the username
  let camButton = null; // Stores image element of the camera button
  let micButton = null; // Stores image element of the mic button
  const initstates = props.location.state; // Stores the states which are passed as input
  let chats = null; // Stores chat logs in HTML format

  if (initstates) {
    if (initstates.chats) {
      chats = initstates.chats;
    }
  }

  // Assigning Image to camera button based on the camera state

  if (VideoStreaming) {
    camButton = (
      <img
        style={{ marginTop: "0.6vw" }}
        src={CamOn}
        alt="Cam On"
        width="55%"
        height="55%"
      />
    );
  } else {
    camButton = (
      <img
        style={{ marginTop: "0.6vw" }}
        src={CamOff}
        alt="Cam Off"
        width="55%"
        height="55%"
      />
    );
  }

  // Assigning Image to mic button based on the camera state

  if (AudioStreaming) {
    micButton = (
      <img
        style={{ marginTop: "0.5vw" }}
        src={MicOn}
        alt="Mic On"
        width="35%"
        height="65%"
      />
    );
  } else {
    micButton = (
      <img
        style={{ marginTop: "0.5vw" }}
        src={MicOff}
        alt="Mic Off"
        width="45%"
        height="65%"
      />
    );
  }

  // Fires when user joins the page

  useEffect(() => {
    dispVideoBox();
    if (initstates) {
      if (nameRef.current) {
        nameRef.current.value = initstates.username;
        setnameValue(nameRef.current.value);
      }
    }
  }, []);

  // Handles event of user clicking on Mic button

  const toggleAudio = () => {
    userVid.current.srcObject.getAudioTracks()[0].enabled =
      !userVid.current.srcObject.getAudioTracks()[0].enabled;
    setAudioStreaming(!AudioStreaming);
  };

  // Handles event of user clicking on Camera button

  const toggleVideo = () => {
    userVid.current.srcObject.getVideoTracks()[0].enabled =
      !userVid.current.srcObject.getVideoTracks()[0].enabled;
    setVideoStreaming(!VideoStreaming);
  };

  // Displays user Video

  const dispVideoBox = () => {
    // Requesting User Media access
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVid.current.srcObject = stream;
        userVid.current.srcObject.getVideoTracks()[0].enabled = VideoStreaming;
        userVid.current.srcObject.getAudioTracks()[0].enabled = AudioStreaming;
      });
  };

  // Fires when user clicks on join button and stops the media acess for this page

  const handleJoin = () => {
    if (userVid.current.srcObject) {
      userVid.current.srcObject.getAudioTracks()[0].stop();
    }
    if (userVid.current.srcObject) {
      userVid.current.srcObject.getVideoTracks()[0].stop();
    }
  };

  // Updates name state

  const handleName = () => {
    setnameValue(nameRef.current.value);
  };

  // Returns all the elements in the roomID/video page

  return (
    <div className="bg">
      <div
        style={{
          position: "absolute",
          top: "6vh",
          left: "16vw",
          color: "yellow",
          fontSize: "2vw",
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
      <div style={micstyle} onClick={toggleAudio} className="Button">
        {micButton}
      </div>
      <div style={camstyle} onClick={toggleVideo} className="Button">
        {camButton}
      </div>
      <Link
        to={{
          pathname: `${match.url}/join`,
          state: {
            video: VideoStreaming,
            audio: AudioStreaming,
            name: nameValue,
            chats: chats,
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
