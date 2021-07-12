import React, { useState, useRef } from "react";
import NavBar from "../Components/NavBar";
import { Fade } from "react-awesome-reveal";
import { v1 } from "uuid";

const JoinMeeting = (props) => {
  const [ChatJoin, setChatJoin] = useState(true);
  const [ChatCreate, setChatCreate] = useState(true);
  const createInpRef = useRef();
  const joinInpRef = useRef();
  const name = {
    display: "inline-block",
    fontSize: "1.5vw",
    width: "30vw",
    height: "4vw",
    backgroundColor: "rgba(255,0,255,0.3)",
    color: "white",
    border: "2px solid purple",
    borderRadius: "10px",
    textAlign: "center",
    marginTop: "7vw",
  };
  let chatjoin = null;
  let chatcreate = null;
  let vidjoin = null;
  let vidcreate = null;
  if (ChatJoin) {
    chatjoin = {
      //   backgroundColor: "rgba(0, 255, 255, 0.6)",
      //   color: "rgb(50,50,50",
      border: "0.2vw solid rgb(0,255,255)",
    };
    vidjoin = null;
  } else {
    vidjoin = {
      //   backgroundColor: "rgba(0, 255, 255, 0.6)",
      //   color: "rgb(50,50,50",
      border: "0.2vw solid rgb(0,255,255)",
    };
    chatjoin = null;
  }

  if (ChatCreate) {
    chatcreate = {
      //   backgroundColor: "rgba(0, 255, 255, 0.6)",
      //   color: "rgb(50,50,50",
      border: "0.2vw solid rgb(0,255,255)",
    };
    vidcreate = null;
  } else {
    vidcreate = {
      //   backgroundColor: "rgba(0, 255, 255, 0.6)",
      //   color: "rgb(50,50,50",
      border: "0.2vw solid rgb(0,255,255)",
    };
    chatcreate = null;
  }

  const chatjoinbutton = {
    ...chatjoin,
    display: "inline-block",
    width: "10vw",
    padding: "1vw",
    // border: "0.2vw solid rgb(0,255,255)",
    borderRadius: "0.5vw",
  };
  const vidjoinbutton = {
    ...vidjoin,
    display: "inline-block",
    width: "10vw",
    padding: "1vw",
    // border: "0.2vw solid rgb(0,255,255)",
    borderRadius: "0.5vw",
  };
  const chatcreatebutton = {
    ...chatcreate,
    display: "inline-block",
    width: "10vw",
    padding: "1vw",
    // border: "0.2vw solid rgb(0,255,255)",
    borderRadius: "0.5vw",
  };
  const vidcreatebutton = {
    ...vidcreate,
    display: "inline-block",
    width: "10vw",
    padding: "1vw",
    borderRadius: "0.5vw",
  };

  const toggleChatJoin = () => {
    setChatJoin(true);
  };
  const toggleVidJoin = () => {
    setChatJoin(false);
  };
  const toggleChatCreate = () => {
    setChatCreate(true);
  };
  const toggleVidCreate = () => {
    setChatCreate(false);
  };

  const handleJoinJoin = () => {
    if (ChatJoin) {
      if (!joinInpRef.current.value) {
      } else {
        props.history.push(`${joinInpRef.current.value}/chat`);
      }
    } else {
      if (!joinInpRef.current.value) {
      } else {
        props.history.push(`${joinInpRef.current.value}/video`);
      }
    }
  };

  const handleCreateJoin = () => {
    if (ChatCreate) {
      if (!createInpRef.current.value) {
        let id = v1();
        props.history.push(`${id}/chat`);
      } else {
        props.history.push(`${createInpRef.current.value}/chat`);
      }
    } else {
      if (!createInpRef.current.value) {
        let id = v1();
        props.history.push(`${id}/video`);
      } else {
        props.history.push(`${createInpRef.current.value}/video`);
      }
    }
  };
  return (
    <div
      className="newroom"
      style={{
        backgroundImage: `url(https://pavbca.com/walldb/original/d/e/1/181669.jpg)`,
      }}
    >
      <NavBar />
      <Fade
        style={{
          display: "inline-block",
          width: "50vw",
          textAlign: "center",
          color: "rgba(0,255,255,0.6)",
          fontSize: "3vw",
          marginTop: "5vh",
          borderRight: "0.15vw solid gold",
          height: "80vh",
          borderRadius: "1.5vw",
        }}
        duration="3000"
      >
        <div>
          Join an Existing Room
          <div
            style={{
              color: "rgb(200,200,200)",
              fontSize: "2vw",
              marginTop: "7vh",
            }}
          >
            <div
              style={chatjoinbutton}
              className="optionButton"
              onClick={toggleChatJoin}
            >
              Chat
            </div>
            <div
              style={vidjoinbutton}
              className="optionButton"
              onClick={toggleVidJoin}
            >
              Video
            </div>
          </div>
          <div>
            <input
              ref={joinInpRef}
              style={name}
              placeholder="Enter Room ID"
            ></input>
            <div
              style={{
                fontSize: "2vw",
                width: "6vw",
                backgroundColor: "green",
                borderRadius: "0.5vw",
                marginLeft: "2vw",
                display: "inline-block",
                cursor: "pointer",
                color: "wheat",
              }}
              onClick={handleJoinJoin}
              // ref={joinRef}
            >
              Join
            </div>
          </div>
        </div>
      </Fade>
      <Fade
        style={{
          display: "inline-block",
          width: "50vw",
          textAlign: "center",
          color: "rgba(0,255,255,0.6)",
          fontSize: "3vw",
          marginTop: "5vh",
          borderLeft: "0.15vw solid gold",
          borderRadius: "1.5vw",
          height: "80vh",
          float: "right",
        }}
        duration="3000"
      >
        <div>
          Create a Custom Room
          <div
            style={{
              color: "rgb(200,200,200)",
              fontSize: "2vw",
              marginTop: "7vh",
            }}
          >
            <div
              style={chatcreatebutton}
              className="optionButton"
              onClick={toggleChatCreate}
            >
              Chat
            </div>
            <div
              style={vidcreatebutton}
              className="optionButton"
              onClick={toggleVidCreate}
            >
              Video
            </div>
          </div>
          <div>
            <input
              ref={createInpRef}
              style={name}
              placeholder="Room ID(Leave empty for Random)"
            ></input>
            <div
              style={{
                fontSize: "2vw",
                width: "6vw",
                backgroundColor: "green",
                borderRadius: "0.5vw",
                marginLeft: "2vw",
                display: "inline-block",
                cursor: "pointer",
                color: "wheat",
              }}
              onClick={handleCreateJoin}
              //   ref={joinRef}
            >
              Join
            </div>
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default JoinMeeting;
