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
        ref={props.chatTitleRef}
        style={{
          fontSize: "2.5vh",
          textAlign: "center",
          paddingTop: "0.25vh",
          paddingBottom: "0.25vh",
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
      <div
        ref={props.chatMessageRef}
        style={{
          bottom: "1vw",
          position: "absolute",
          backgroundColor: "#1f013ace",
          borderRadius: "1.4vw",
          marginLeft: "0.5vw",
        }}
      >
        <textarea
          rows="1"
          ref={inputRef}
          type="text"
          autoComplete="off"
          placeholder="Chat with others ..."
          onChange={updateMessage}
          onKeyPress={handleKeypress}
          style={{
            height: "3vw",
            width: "90%",
            paddingLeft: "1vw",
            paddingRight: "1.5vw",
            paddingTop: "0.8vw",
            border: "none",

            backgroundColor: "rgba(0,0,0,0)",
            color: "white",
            outline: "none",

            fontSize: "1vw",
            resize: "none",
          }}
        />
        <div
          style={{
            // position: "relative",
            float: "right",
            // top: "-0.5vw",
            backgroundColor: "#1f013ace",
            border: "none",
            width: "1vw",
            marginTop: "1vw",
            marginRight: "0.5vw",
          }}
          ref={buttonRef}
          onClick={() => {
            props.action(message);
            clearMessage();
            updateMessage();
          }}
        >
          <img src={sendButton} alt="send" width="100%" height="100%" />
        </div>
      </div>
    </div>
  );
};

export default ChatOutput;
