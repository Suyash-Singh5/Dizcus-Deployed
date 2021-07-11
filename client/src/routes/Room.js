import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import ChatOutput from "../Components/ChatOutput";
import Footer from "../Components/Footer";
import "../Room.css";
import AddParticipantPanel from "../Components/AddParticipantPanel";
import AllParticipants from "../Components/AllParticipants";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

// Styled Video Component for every video window

const VideoBox = styled.video`
  border: 1px solid blue;
  border-radius: 10px;
`;

/* This function returns a Styled Video component when a new Peer connection is established
   It takes the peer object and the height and width of video box as an input parameter */

const VideoPeer = (props) => {
  const ref = useRef();
  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <VideoBox
      style={{ height: `${props.height}vw`, width: `${props.width}vw` }}
      playsInline
      autoPlay
      ref={ref}
    />
  );
};

// This object controls the resolution and dimensions of the video input stream

const videoConstraints = {
  height: 1080,
  width: 1920,
};

/* Main functional componenet which contains all the room components
  It takes the roomID and the initial state of camera and mic buttons */

const Room = (props) => {
  // Initializing Input Parameters

  const roomID = props.match.params.roomID; // Contains Room ID
  const initstates = props.location.state; // Contains initial state of Mic and Camera buttons

  // Initializing Reference Variables

  const socketRef = useRef(); // Refers to client side socket object
  const userVideo = useRef(); // Refers to video component of user
  const peersRef = useRef([]); // Refers to all the peers connected to the client
  const chatsLogRef = useRef([]); // Refers to the component where the chat is stored
  const chatRef = useRef([]); // Refers to the complete chat component
  const ParticipantsLogRef = useRef([]); // Refers to the component where the participants are displayed
  const ParticipantsRef = useRef([]); // Refers to the complete Participants window
  const AddParticipantRef = useRef([]); // Refers to the complete add Participants window
  const MaxScreenRef = useRef([]); // Refers to the Maximize screen button
  const MinScreenRef = useRef([]); // Refers to the Minimize screen button

  // Initaializing State Variables

  const [peers, setPeers] = useState([]); // Contains array of peer objects
  const [VideoStreaming, setVideoStreaming] = useState(false); // Handles the state of Camera i.e On or Off
  const [AudioStreaming, setAudioStreaming] = useState(false); // Handles the state of Mic i.e On or Off
  const [ScreenSharing, setScreenSharing] = useState(false); // Handles the state of Screen Sharing mode i.e presenting or not
  const [VideosRightMargin, setVideosRightMargin] = useState(2); // Responsible for changing Right margin of block of Videos
  const [MiniVideoRightMargin, setMiniVideoRightMargin] = useState(8); // Responsible for changing Right margin of small video box in case of 2 users

  // Initializing Other Variables

  let count = peersRef.current.length + 1; // Dynamically stores the count of number of participants
  let username = "Anonymous User"; // Initializes username if not entered
  const handle = useFullScreenHandle(); // Function which handles full screen button

  // Use Effect handling joining , leaving and chatting of users

  useEffect(() => {
    socketRef.current = io.connect("/");
    if (chatsLogRef.current && initstates) {
      if (initstates.chat) {
        chatsLogRef.current.innerHTML = initstates.chats;
      }
    }
    if (MinScreenRef.current) {
      MinScreenRef.current.style.display = "none";
    }
    // Requests user for media access
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        addNewUser(stream);
        socketRef.current.on("recieve message", (message) => {
          if (chatsLogRef.current) {
            chatsLogRef.current.innerHTML += `
              <p class="chatText">
                <b>${message.name}</b> :  ${message.message}
              </p>`;
          }
        });

        removeUser();
      });
  }, []);

  // This function adds a new user to the Video Call

  const addNewUser = (stream) => {
    userVideo.current.srcObject = stream;
    let video = userVideo.current;
    let initstream = video.srcObject;
    const videotrack = initstream.getVideoTracks()[0];
    const audiotrack = initstream.getAudioTracks()[0];

    // Handling initial state of Camera and Mic
    if (initstates) {
      videotrack.enabled = initstates.video;
      audiotrack.enabled = initstates.audio;
      setVideoStreaming(initstates.video);
      setAudioStreaming(initstates.audio);
      if (initstates.name) {
        username = initstates.name;
      }
    } else {
      videotrack.enabled = false;
      audiotrack.enabled = false;
    }

    // Checking if user does not exist to prevent multiple connections
    socketRef.current.emit("current users", socketRef.current.id, roomID);
    socketRef.current.on("add user", (add) => {
      if (add) {
        // Adding New user to the room
        socketRef.current.emit("join room", roomID, username, false);
        socketRef.current.on("all users", (users) => {
          // Establishing P2P connection for the new user
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push({
              peer,
              peerID: userID,
            });
          });
          setPeers(peers);
        });
      }
    });

    // Existing Users recieve signal

    socketRef.current.on("user joined", (payload) => {
      const peer = addPeer(payload.signal, payload.callerID, stream);
      // Existing users add a P2P connection with the new user
      peersRef.current.push({
        peerID: payload.callerID,
        peer,
      });
      const peerObj = {
        peer,
        peerID: payload.callerID,
      };
      setPeers((users) => [...users, peerObj]);
    });

    socketRef.current.on("receiving returned signal", (payload) => {
      const item = peersRef.current.find((p) => p.peerID === payload.id);
      item.peer.signal(payload.signal);
    });
  };

  // This function destroys the P2P connection with the user which leaves

  const removeUser = () => {
    socketRef.current.on("user left", (id) => {
      const peerObj = peersRef.current.find((p) => p.peerID === id);
      if (peerObj) {
        peerObj.peer.destroy();
      }
      const peers = peersRef.current.filter((p) => p.peerID !== id);
      peersRef.current = peers;
      setPeers(peers);
    });
  };

  /* This function creates a peer between 2 clients.
  It takes the socket ids of both the clients along with media stream as input */

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  };

  /* This function is similar to the above function with the only difference 
  being that it completes the 2 way signal instead of starting it. */

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  // This function turns on and off the camera button

  const toggleVideo = async () => {
    let video = userVideo.current;
    let stream = video.srcObject;
    const videotrack = stream.getVideoTracks()[0];
    videotrack.enabled = !videotrack.enabled;
    if (!VideoStreaming) {
      setVideoStreaming(true);
    } else {
      setVideoStreaming(false);
    }
  };

  // This function turns on and off the mic button

  const toggleAudio = async () => {
    let video = userVideo.current;
    let stream = video.srcObject;
    const audiotrack = stream.getAudioTracks()[0];
    audiotrack.enabled = !audiotrack.enabled;
    if (!AudioStreaming) {
      setAudioStreaming(true);
    } else {
      setAudioStreaming(false);
    }
  };

  // This function handles the event of cut (leave) call button

  const toggleCutCall = () => {
    userVideo.current.srcObject.getVideoTracks()[0].stop();
    userVideo.current.srcObject.getAudioTracks()[0].stop();
    socketRef.current.emit("get name", socketRef.current.id);
    socketRef.current.on("fetch name", async (username) => {
      props.history.push(`/${props.match.params.roomID}/chat`, {
        username: username,
        chats: chatsLogRef.current ? chatsLogRef.current.innerHTML : null,
      });
      await socketRef.current.emit("cut call");
      removeUser();
    });
  };

  // This function handles the event of screen share (present) button

  const toggleScreenShare = () => {
    if (!ScreenSharing) {
      setScreenSharing(true);

      // Requesting User screen (display) media
      navigator.mediaDevices
        .getDisplayMedia({ cursor: true })
        .then((stream) => {
          let screenShareTrack = stream.getVideoTracks()[0];
          userVideo.current.srcObject = stream;
          peerReplaceTrack(screenShareTrack);
          setPeers(peersRef.current);

          // Ending through browser button
          screenShareTrack.onended = () => {
            endScreenShare();
          };
        });
    } else {
      // Ending through toggling
      endScreenShare();
      setPeers(peersRef.current);
    }
  };

  /* This function handles the event of ending screen share 
  i.e replacing the screen share media with the webcam media */

  const endScreenShare = () => {
    setScreenSharing(false);

    // Requesting again the user media to replace with display media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        let newvidTrack = stream.getVideoTracks()[0];
        peerReplaceTrack(newvidTrack);
        userVideo.current.srcObject = stream;

        // Making sure state of audio and video is similar to that before presenting
        userVideo.current.srcObject.getVideoTracks()[0].enabled =
          VideoStreaming;
        userVideo.current.srcObject.getAudioTracks()[0].enabled =
          AudioStreaming;
      });
  };

  // Special Function to Replace Tracks for every peer

  const peerReplaceTrack = (newTrack) => {
    if (peersRef.current) {
      peersRef.current.forEach((peer) => {
        let oldTrack = peer.peer.streams[0].getVideoTracks()[0];
        peer.peer.replaceTrack(oldTrack, newTrack, peer.peer.streams[0]);
      });
    }
  };

  // Handling event of clicking on the Paricipants button (to view all participants)

  const toggleParticipants = () => {
    // Making sure that right panel has only Participants panel

    if (ParticipantsRef.current.style.display === "none") {
      if (chatRef.current.style.display === "block") {
        chatRef.current.style.display = "none";
      }
      if (AddParticipantRef.current.style.display === "block") {
        AddParticipantRef.current.style.display = "none";
      }
      ParticipantsRef.current.style.display = "block";
      socketRef.current.emit("display users");
      socketRef.current.on("all names", (vidnames, chatnames) => {
        // DOM manipulation
        if (ParticipantsLogRef.current) {
          ParticipantsLogRef.current.innerHTML = null;
          if (vidnames.length > 0) {
            let counter = 0;
            ParticipantsLogRef.current.innerHTML += ` <div class="participantHeading">Video Room</div>`;
            vidnames.forEach((name) => {
              counter += 1;
              ParticipantsLogRef.current.innerHTML += ` <p class="chaText">${counter}. ${name}</p>`;
            });
          }
          if (chatnames.length > 0) {
            let counter = 0;
            ParticipantsLogRef.current.innerHTML += ` <div class="participantHeading">Chat Room</div>`;
            chatnames.forEach((name) => {
              counter += 1;
              ParticipantsLogRef.current.innerHTML += ` <p class="chaText">${counter}. ${name}</p>`;
            });
          }
        }
      });

      // Making space for right panel
      setVideosRightMargin(18);
      setMiniVideoRightMargin(0);
    } else {
      ParticipantsRef.current.style.display = "none";
      setVideosRightMargin(2);
      setMiniVideoRightMargin(8);
    }
  };

  // Handling event of clicking on add participants button

  const toggleAddParticipants = () => {
    // Making sure that right panel has only Add Participants panel

    if (chatRef.current.style.display === "block") {
      chatRef.current.style.display = "none";
    }
    if (ParticipantsRef.current.style.display === "block") {
      ParticipantsRef.current.style.display = "none";
    }
    if (AddParticipantRef.current.style.display === "none") {
      AddParticipantRef.current.style.display = "block";

      // Making space for right panel
      setVideosRightMargin(18);
      setMiniVideoRightMargin(0);
    } else {
      AddParticipantRef.current.style.display = "none";
      setVideosRightMargin(2);
      setMiniVideoRightMargin(8);
    }
  };

  /* This function allows to send message to all peers in the room
  It takes message object as an input which contains the name of sender and the actual message */

  const handleSendMessage = (message) => {
    if (message) {
      socketRef.current.emit("send message", message);

      // DOM Manipulation
      if (chatsLogRef.current) {
        chatsLogRef.current.innerHTML += `
        <p class="chaText">
          <b>You</b> :  ${message}
        </p>`;
      }
    }
  };

  // This function controls display of chat panel

  const toggleChat = () => {
    // Making sure that right panel has only Chat panel

    if (ParticipantsRef.current.style.display === "block") {
      ParticipantsRef.current.style.display = "none";
    }
    if (AddParticipantRef.current.style.display === "block") {
      AddParticipantRef.current.style.display = "none";
    }
    if (chatRef.current.style.display === "none") {
      chatRef.current.style.display = "block";

      // Making space for right panel
      setVideosRightMargin(18);
      setMiniVideoRightMargin(0);
    } else {
      chatRef.current.style.display = "none";
      setVideosRightMargin(2);
      setMiniVideoRightMargin(8);
    }
  };

  // Handles the event on clicking the Full Screen button

  const toggleFullScreen = () => {
    if (MaxScreenRef.current.style.display === "none") {
      MaxScreenRef.current.style.display = "inline-block";
      MinScreenRef.current.style.display = "none";
    } else {
      MaxScreenRef.current.style.display = "none";
      MinScreenRef.current.style.display = "inline-block";
    }
  };

  /* This function returns the height, width and orientation of the
   local user Video frame and also that of Peer video frame. 
   An object is returned with the video parameters. */

  const videoparams = (count) => {
    let userheight,
      userwidth,
      peerheight,
      peerwidth,
      usertop,
      userleft = 0;
    let pos = "relative";
    if (count === 1) {
      userheight = 90 * 0.496;
      userwidth = 79.2;
      pos = "relative";
      usertop = 0;
      userleft = 0;
    } else if (count === 2) {
      peerheight = 88 * 0.496;
      peerwidth = 77.44;
      userheight = 20 * 0.496;
      userwidth = 17.6;
      usertop = 68 * 0.496;
      userleft = 62 + MiniVideoRightMargin;
      pos = "absolute";
    } else if (count < 5 && count > 2) {
      userheight = 88 * 0.5 * 0.496;
      userwidth = 77.44 / 2;
      peerheight = 88 * 0.5 * 0.496;
      peerwidth = 77.44 / 2;
      usertop = 0;
      userleft = 0;
      pos = "relative";
    } else {
      userheight = 88 * 0.33 * 0.496;
      userwidth = 77.44 / 3;
      peerheight = (88 / 3) * 0.496;
      peerwidth = 77.44 / 3;
    }
    return {
      userheight: userheight,
      userwidth: userwidth,
      peerheight: peerheight,
      peerwidth: peerwidth,
      usertop: usertop,
      userleft: userleft,
      userpos: pos,
    };
  };

  /* Finally, all the components with relevant references, 
  action functions and other parameters are rendered below */

  return (
    <FullScreen handle={handle}>
      <div className="bg">
        <div
          style={{
            marginLeft: "0vw",
            marginRight: `${VideosRightMargin}vw`,
            marginTop: "1vh",
            marginBottom: "4vw",
            textAlign: "center",
            padding: "0px",
          }}
        >
          {peersRef.current.map((peer) => {
            return (
              <VideoPeer
                height={videoparams(count).peerheight}
                width={videoparams(count).peerwidth}
                key={peer.peerID}
                peer={peer.peer}
              />
            );
          })}
          <VideoBox
            style={{
              position: `${videoparams(count).userpos}`,
              height: `${videoparams(count).userheight}vw`,
              width: `${videoparams(count).userwidth}vw`,
              top: `${videoparams(count).usertop}vw`,
              left: `${videoparams(count).userleft}vw`,
            }}
            ref={userVideo}
            autoPlay
            playsInline
            muted
          />
        </div>
        <ChatOutput
          chatRef={chatRef}
          chatsLogRef={chatsLogRef}
          action={handleSendMessage}
        />
        <AllParticipants
          ParticipantsRef={ParticipantsRef}
          ParticipantsLogRef={ParticipantsLogRef}
        />
        <AddParticipantPanel
          roomID={roomID}
          AddParticipantRef={AddParticipantRef}
        />
        <Footer
          VideoStreaming={VideoStreaming}
          AudioStreaming={AudioStreaming}
          ScreenSharing={ScreenSharing}
          VideoAction={toggleVideo}
          AudioAction={toggleAudio}
          CutCallAction={toggleCutCall}
          ScreenShareAction={toggleScreenShare}
          ParticipantsAction={toggleParticipants}
          AddParticipantAction={toggleAddParticipants}
          ChatAction={toggleChat}
          Count={count}
          FullScreenAction={toggleFullScreen}
          MaxScreenRef={MaxScreenRef}
          MinScreenRef={MinScreenRef}
          handleFullScreen={handle.enter}
          exitFullScreen={handle.exit}
        />
      </div>
    </FullScreen>
  );
};

export default Room;
