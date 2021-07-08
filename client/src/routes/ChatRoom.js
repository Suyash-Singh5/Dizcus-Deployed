import React, { useRef, useEffect } from "react";
import ChatOutput from "../Components/ChatOutput";
import io from "socket.io-client";

const ChatRoom = (props) => {
  const chatRef = useRef();
  const chatsLogRef = useRef();
  const chatMessageRef = useRef();
  const socketRef = useRef();
  const nameRef = useRef();
  const nameInpRef = useRef();
  const chatBlockRef = useRef();
  const roomID = props.match.params.roomID;
  let username = null;
  const handleJoin = () => {
    if (chatRef.current) {
      chatRef.current.style.display = "block";
      chatRef.current.style.width = "80vw";
      chatRef.current.style.height = "95vh";
      chatRef.current.style.marginRight = "10vw";
      chatMessageRef.current.style.width = "60vw";
      chatMessageRef.current.style.marginLeft = "10vw";
    }
    username = nameInpRef.current.value;
    nameRef.current.style.display = "none";
    chatBlockRef.current.style.display = "block";
    socketRef.current = io.connect("/");
    socketRef.current.emit("join room", roomID, username);
    socketRef.current.emit("display users");
    socketRef.current.on("all names", (names) => console.log(names));
  };
  const handleSendMessage = () => {};

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.style.display = "block";
      chatRef.current.style.width = "80vw";
      chatRef.current.style.textAlign = "center";
    }
  }, []);

  return (
    <div style={{ textAlign: "center" }} className="bg">
      <div ref={nameRef} style={{ marginTop: "20vh", textAlign: "center" }}>
        <div style={{ fontSize: "2vw", color: "white" }}>Enter your name </div>
        <input ref={nameInpRef} style={{ width: "20vw" }}></input>
        <button onClick={handleJoin}>Join</button>
      </div>
      <div ref={chatBlockRef} style={{ display: "none" }}>
        {/* <h1>Hi this is Chat Room</h1> */}
        <div style={{ textAlign: "center" }}>
          <ChatOutput
            chatRef={chatRef}
            chatsLogRef={chatsLogRef}
            chatMessageRef={chatMessageRef}
            action={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
