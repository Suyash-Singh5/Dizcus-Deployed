import React, { useRef, useEffect, useState } from "react";
import ChatOutput from "../Components/ChatOutput";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import CutCall from "../Components/CutCall";
import vidcall from "../Images/vidcall.png";

const ChatRoom = (props) => {
  const chatRef = useRef();
  const chatsLogRef = useRef();
  const chatMessageRef = useRef();
  const socketRef = useRef();
  const nameRef = useRef();
  const joinRef = useRef();
  const nameInpRef = useRef();
  const chatBlockRef = useRef();
  const chatTitleRef = useRef();
  const roomID = props.match.params.roomID;
  const initstates = props.location.state;
  let username = null;

  const name = {
    fontSize: "2.2vw",
    width: "30vw",
    backgroundColor: "rgba(255,0,255,0.3)",
    color: "white",
    border: "2px solid purple",
    borderRadius: "10px",
    textAlign: "center",
  };

  if (chatRef.current) {
    chatRef.current.style.display = "block";
    chatRef.current.style.width = "80vw";
    chatRef.current.style.textAlign = "center";
  }

  useEffect(() => {
    socketRef.current = io.connect("/");
    if (initstates) {
      if (nameInpRef.current) {
        nameInpRef.current.value = initstates.username;
        joinRef.current.click();
      }
      if (chatsLogRef.current && initstates.chats) {
        chatsLogRef.current.innerHTML = initstates.chats;
      }
    }

    socketRef.current.on("recieve message", (message) => {
      if (chatsLogRef.current) {
        chatsLogRef.current.innerHTML += `
              <p class="chatText">
                <b>${message.name}</b> :  ${message.message}
              </p>`;
      }
    });
  }, []);

  const handleJoin = () => {
    if (nameInpRef.current.value) {
      if (chatRef.current) {
        chatRef.current.style.display = "block";
        chatRef.current.style.width = "80vw";
        chatRef.current.style.height = "95vh";
        chatRef.current.style.backgroundColor = "rgba(50,0,50,0.8)";
        chatRef.current.style.marginRight = "10vw";
        chatMessageRef.current.style.width = "55vw";
        chatMessageRef.current.style.fonstSize = "1.2vw";
        chatMessageRef.current.style.marginLeft = "5vw";
        chatsLogRef.current.style.marginLeft = "5vw";
        chatsLogRef.current.style.marginRight = "3vw";
        chatsLogRef.current.style.fontSize = "1vw";
        chatTitleRef.current.style.fontSize = "2vw";
        if (initstates) {
          if (initstates.title) {
            chatTitleRef.current.innerText = initstates.title;
          }
        }
      }
      username = nameInpRef.current.value;
      nameRef.current.style.display = "none";
      chatBlockRef.current.style.display = "block";
      socketRef.current.emit("join room", roomID, username, true);
    }
  };

  const handleSendMessage = (message) => {
    if (message) {
      socketRef.current.emit("send message", message);
      if (chatsLogRef.current) {
        chatsLogRef.current.innerHTML += `
        <p class="chaText">
          <b>You</b> :  ${message}
        </p>`;
      }
    }
  };

  const leaveChat = () => {
    socketRef.current.emit("cut call");
  };

  const handleJoinVideo = () => {
    socketRef.current.emit("cut call");
    props.history.push(`/${props.match.params.roomID}/video`, {
      username: username,
      chats: chatsLogRef.current.innerHTML,
    });
  };

  return (
    <div className="bg">
      <div ref={nameRef} style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "4vw",
            color: "yellow",
            // fontFamily: "Ubuntu",
            marginTop: "5vw",
            marginBottom: "10vw",
          }}
        >
          Dizcus Chat
        </div>
        <input
          ref={nameInpRef}
          style={name}
          placeholder="Enter your name"
        ></input>
        <div
          style={{
            fontSize: "2vw",
            width: "6vw",
            backgroundColor: "green",
            border: "none",
            borderRadius: "0.5vw",
            marginLeft: "2vw",
            // fontFamily: "times-new-roman",
            display: "inline-block",
            cursor: "pointer",
          }}
          onClick={handleJoin}
          ref={joinRef}
        >
          Join
        </div>
      </div>
      <div ref={chatBlockRef} style={{ display: "none" }}>
        <div style={{}}>
          <ChatOutput
            chatTitleRef={chatTitleRef}
            chatRef={chatRef}
            chatsLogRef={chatsLogRef}
            chatMessageRef={chatMessageRef}
            action={handleSendMessage}
          />
        </div>

        <div
          style={{ position: "absolute", bottom: "3vw", left: "75vw" }}
          className="button-container"
        >
          <div style={{ textAlign: "left" }} className="buttonText">
            Video Call
          </div>
          <div onClick={handleJoinVideo} className="Button">
            <img
              style={{ marginTop: "0.3vw" }}
              src={vidcall}
              alt="Video Call"
              width="60%"
              height="80%"
            ></img>
          </div>
        </div>

        <div>
          <Link to="/">
            <div
              onClick={leaveChat}
              style={{ position: "absolute", bottom: "3vw", left: "82vw" }}
            >
              <CutCall />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
