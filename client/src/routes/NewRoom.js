import React from "react";
import { v1 } from "uuid";
import NavBar from "../Components/NavBar";
import { Fade } from "react-awesome-reveal";
import tick from "../Images/tick.png";
import conference from "../Images/conference.png";
import chat_symbol from "../Images/chat_symbol.png";
import video_symbol from "../Images/video_symbol.png";
import rooms_symbol from "../Images/rooms_symbol.png";
import ss_symbol from "../Images/ss_symbol.png";

export const NewRoom = (props) => {
  const style = {
    backgroundColor: "rgba(0,0,0,0.2)",
    color: "rgba(255,255,255,0.9)",
    width: "14vw",
    height: "8vw",
    fontSize: "1.75vw",
    cursor: "pointer",
    display: "inline-block",
    position: "relative",
    top: "-20vw",
    left: "9vw",
    border: "0.2vw solid rgb(255,100,0)",
    borderRadius: "2vw",
    backgroundImage: "none",
    // fontFamily: "times-new-roman",
  };

  function createVideoID() {
    const id = v1();
    props.history.push(`/${id}/video`);
  }

  function createChatID() {
    const id = v1();
    props.history.push(`/${id}/chat`);
  }

  const tickStyle = {
    textAlign: "right",
    display: "inline-block",
    float: "right",
    width: "2vw",
    marginRight: "2vw",
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
          color: "rgba(255,255,0)",
          textAlign: "center",
          position: "relative",
          fontSize: "3.5vw",
          backgroundColor: "none",
          // fontFamily: "serif",
        }}
      >
        <p>Welcome to Dizcus!</p>
      </Fade>
      <Fade
        direction="left"
        duration="2000"
        style={{
          // backgroundColor: "rgba(100,0,255,0.5)",
          // height: "60vh",
          width: "20vw",
          marginLeft: "15vw",
          marginTop: "4vh",
          display: "inline-block",
          // border: "1px solid red",
        }}
      >
        <div>
          <div
            className="features"
            style={{
              backgroundColor: "rgba(81, 162, 213,0.6)",
              borderTopLeftRadius: "1vw",
              borderTopRightRadius: "1vw",
            }}
          >
            Easy to Use
            <div style={tickStyle}>
              <img src={tick} alt="tick" width="100%" />
            </div>
          </div>
          <div
            className="features"
            style={{ backgroundColor: "rgba(18, 92, 170,0.6)" }}
          >
            Private
            <div style={tickStyle}>
              <img src={tick} alt="tick" width="100%" />
            </div>
          </div>
          <div
            className="features"
            style={{ backgroundColor: "rgba(2, 47, 142,0.6)" }}
          >
            Peer to Peer
            <div style={tickStyle}>
              <img src={tick} alt="tick" width="100%" />
            </div>
          </div>
          <div
            className="features"
            style={{ backgroundColor: "rgba(3, 12, 84,0.6)" }}
          >
            Agile
            <div style={tickStyle}>
              <img src={tick} alt="tick" width="100%" />
            </div>
          </div>
          <div
            className="features"
            style={{
              backgroundColor: "rgba(1, 1, 63,0.6)",
              borderBottomLeftRadius: "1vw",
              borderBottomRightRadius: "1vw",
            }}
          >
            Open Source
            <div style={tickStyle}>
              <img src={tick} alt="tick" width="100%" />
            </div>
          </div>
        </div>
      </Fade>
      <Fade
        duration="2000"
        style={{ ...style, backgroundColor: "none", border: "none" }}
        className="createButton"
      >
        <button
          style={{
            ...style,
            left: "0vw",
            top: "0vh",
          }}
          className="createButton"
          onClick={createVideoID}
        >
          Create A <strong>Video</strong> Room
        </button>
      </Fade>
      <Fade
        duration="2000"
        style={{
          ...style,
          top: "-5vw",
          left: "-5vw",
          backgroundColor: "none",
          border: "none",
        }}
        className="createButton"
      >
        <button
          style={{
            ...style,
            top: "0vw",
            left: "0vw",
          }}
          className="createButton"
          onClick={createChatID}
        >
          Create A <strong>Chat</strong> Room
        </button>
      </Fade>
      <Fade
        duration="4000"
        style={{
          display: "inline-block",
          width: "20vw",
        }}
      >
        <div>
          <div
            className="features"
            style={{
              backgroundColor: "rgba(81, 162, 213,0.6)",
              borderTopLeftRadius: "1vw",
              borderTopRightRadius: "1vw",
            }}
          >
            Video Conference
            <img
              style={{ marginRight: "1vw", float: "right" }}
              src={video_symbol}
              width="14%"
            ></img>
          </div>
          <div
            className="features"
            style={{ backgroundColor: "rgba(18, 92, 170,0.6)" }}
          >
            Group Call
            <img
              style={{ marginRight: "1vw", float: "right" }}
              src={conference}
              width="17%"
            ></img>
          </div>
          <div
            className="features"
            style={{ backgroundColor: "rgba(2, 47, 142,0.6)" }}
          >
            Chat
            <img
              style={{ marginRight: "1vw", float: "right" }}
              src={chat_symbol}
              width="14%"
            ></img>
          </div>
          <div
            className="features"
            style={{ backgroundColor: "rgba(3, 12, 84,0.6)" }}
          >
            Custom Rooms
            <img
              style={{ marginRight: "1vw", float: "right" }}
              src={rooms_symbol}
              width="14%"
            ></img>
          </div>
          <div
            className="features"
            style={{
              backgroundColor: "rgba(1, 1, 63,0.6)",
              borderBottomLeftRadius: "1vw",
              borderBottomRightRadius: "1vw",
            }}
          >
            Screen Share
            <img
              style={{ marginRight: "1vw", float: "right" }}
              src={ss_symbol}
              width="12%"
            ></img>
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default NewRoom;
