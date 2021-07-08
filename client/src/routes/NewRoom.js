import React from "react";
import { v1 } from "uuid";
import NavBar from "../Components/NavBar";
import bg from "../Images/bg2.jpg";
import { Fade } from "react-awesome-reveal";
import tick from "../Images/tick.png";

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
    fontFamily: "times-new-roman",
  };

  const style2 = {
    backgroundImage: { bg },
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
          fontFamily: "serif",
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
              <img src={tick} width="100%" />
            </div>
          </div>
          <div
            className="features"
            style={{ backgroundColor: "rgba(28, 112, 200,0.6)" }}
          >
            Private
            <div style={tickStyle}>
              <img src={tick} width="100%" />
            </div>
          </div>
          <div
            className="features"
            style={{ backgroundColor: "rgba(2, 47, 142,0.6)" }}
          >
            Peer to Peer
            <div style={tickStyle}>
              <img src={tick} width="100%" />
            </div>
          </div>
          <div
            className="features"
            style={{ backgroundColor: "rgba(3, 12, 84,0.6)" }}
          >
            Agile
            <div style={tickStyle}>
              <img src={tick} width="100%" />
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
              <img src={tick} width="100%" />
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
          </div>
          <div
            className="features"
            style={{ backgroundColor: "rgba(28, 112, 200,0.6)" }}
          >
            Chat
          </div>
          <div
            className="features"
            style={{ backgroundColor: "rgba(2, 47, 142,0.6)" }}
          >
            Group Call
          </div>
          <div
            className="features"
            style={{ backgroundColor: "rgba(3, 12, 84,0.6)" }}
          >
            Share Large Files
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
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default NewRoom;
