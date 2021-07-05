import React, { useState, useRef, useEffect } from "react";
import sendButton from "../Images/send.png";
const ChatOutput = (props) => {
  const [message, setMessage] = useState(null);
  const inputRef = useRef();
  const buttonRef = useRef();

  // Maintains and updates the message state variable
  const updateMessage = () => {
    setMessage(inputRef.current.value);
  };

  // Clear Input box after sending message
  const clearMessage = () => {
    inputRef.current.value = null;
  };

  // Enables to Send Messages by pressing enter key
  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      buttonRef.current.click();
      e.preventDefault();
    }
  };

  return (
    <div ref={props.chatRef} className="chat" style={{ display: "none" }}>
      {/* This div contains Chat Window Logo */}
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
        Chat Window
      </div>

      {/* This div contains the chat log */}
      <div
        ref={props.chatsLogRef}
        style={{
          paddingLeft: "1vw",
          marginTop: "1vh",
          maxHeight: "75vh",
          overflow: "auto",
        }}
      ></div>

      {/* This div contains the input writing box along with send button */}
      <div>
        <textarea
          rows="1"
          ref={inputRef}
          type="text"
          autoComplete="off"
          placeholder="Chat with others ..."
          onChange={updateMessage}
          onKeyPress={handleKeypress}
          style={{
            height: "5vh",
            width: "17vw",
            paddingLeft: "1vw",
            paddingRight: "1.5vw",
            paddingTop: "1vh",
            border: "none",
            borderRadius: "0.5vw",
            backgroundColor: "#1f013ace",
            color: "white",
            outline: "none",
            left: "0.5vw",
            bottom: "2vh",
            position: "absolute",
            resize: "none",
          }}
        />
        <button
          style={{
            position: "absolute",
            bottom: "3vh",
            left: "15.5vw",
            backgroundColor: "rgba(0,0,0,0)",
            border: "none",
            width: "1.5vw",
          }}
          ref={buttonRef}
          onClick={() => {
            props.action(message);
            clearMessage();
            updateMessage();
          }}
        >
          <img src={sendButton} alt="send" width="100%" height="100%" />
        </button>
      </div>
    </div>
  );
};

export default ChatOutput;
