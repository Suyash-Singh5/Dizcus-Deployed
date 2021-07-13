import React, { useRef, useEffect, useState } from "react";
import ChatOutput from "../Components/ChatOutput";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import CutCall from "../Components/CutCall";
import vidcall from "../Images/vidcall.png";

/* Main functional element which renders the chat room 
It takes props as an input which contains the initial states like userame */

const ChatRoom = (props) => {
  const chatRef = useRef(); // Refers to complete chat window
  const chatsLogRef = useRef(); // Refers to chat logs (where chats are stored)
  const chatMessageRef = useRef(); // Refers to text area(where messages are typed) and send button
  const socketRef = useRef(); // Refers to client side socket object
  const nameRef = useRef(); // Refers to complete div which appears before chat window
  const joinRef = useRef(); // Refers to Join Chat Room button
  const nameInpRef = useRef(); // Refers to Input where Name is entered
  const chatBlockRef = useRef(); // Refers to complete Chat window along with buttons
  const chatTitleRef = useRef(); // Refers to Title div of the Chat Window
  const roomID = props.match.params.roomID; // Room ID
  const initstates = props.location.state; // States like username, chat logs and Chat Title stored here
  let username = null; // Stores name of the user

  // Styles the Input name element

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

  // Connects to client side socket and also recieve chat message

  useEffect(() => {
    socketRef.current = io.connect("/");

    // Checks if redirected from the video room
    if (initstates) {
      if (nameInpRef.current) {
        nameInpRef.current.value = initstates.username;
        joinRef.current.click();
      }
      if (chatsLogRef.current && initstates.chats) {
        chatsLogRef.current.innerHTML = initstates.chats;
      }
    }

    // If message is recieved adds to chat Log
    socketRef.current.on("recieve message", (message) => {
      if (chatsLogRef.current) {
        chatsLogRef.current.innerHTML += `
              <p class="chatText">
                <b>${message.name}</b> :  ${message.message}
              </p>`;
      }
    });
  }, []);

  /* This function handles actions to be taken when user clicks on join button
     Mainly this function diplays the chat window using the chat oputput component
     and modifying it accordingly by using useRef */

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

  /* This function sends chat message to all users when send button is clicked
  It also updates the innrHTML of the user who sent the message */

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

  // Disconnects user from the room

  const leaveChat = () => {
    socketRef.current.emit("cut call");
  };

  /* This function handles the actions taken when the user clicks on join video call button
  The user is disconnected from the room and then reconnected in the video room */

  const handleJoinVideo = () => {
    socketRef.current.emit("cut call");
    props.history.push(`/${props.match.params.roomID}/video`, {
      username: username,
      chats: chatsLogRef.current.innerHTML,
    });
  };

  // Returns all the elements in the chat room

  return (
    <div className="bg">
      <div ref={nameRef} style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "4vw",
            color: "yellow",
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
