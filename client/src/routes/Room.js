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

// const Container = styled.div`
//   padding: 20px;
//   display: flex;
//   height: 100vh;
//   width: 90%;
//   margin: auto;
//   flex-wrap: wrap;
// `;

const VideoBox = styled.video`
  border: 1px solid blue;
  border-radius: 10px;
`;

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

const videoConstraints = {
  height: 1080,
  width: 1920,
};

const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const chatsLogRef = useRef([]);
  const chatRef = useRef([]);
  const ParticipantsLogRef = useRef([]);
  const ParticipantsRef = useRef([]);
  const AddParticipantRef = useRef([]);
  const MaxScreenRef = useRef([]);
  const MinScreenRef = useRef([]);
  const roomID = props.match.params.roomID;
  const initstates = props.location.state;
  const [VideoStreaming, setVideoStreaming] = useState(false); // Handles the state of Camera i.e On or Off
  const [AudioStreaming, setAudioStreaming] = useState(false); // Handles the state of Mic i.e On or Off
  const [ScreenSharing, setScreenSharing] = useState(false); // Handles the state of Screen Sharing mode i.e presenting or not
  const [VideosRightMargin, setVideosRightMargin] = useState(2); // Responsible for changing Right margin of block of Videos
  const [MiniVideoRightMargin, setMiniVideoRightMargin] = useState(8); // Responsible for changing Right margin of small video box in special case of 2 users
  let count = peersRef.current.length + 1;
  let username = "Anonymous User";
  const handle = useFullScreenHandle();
  useEffect(() => {
    socketRef.current = io.connect("/");
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        addNewUser(stream);
        socketRef.current.on("recieve message", (message) => {
          if (chatsLogRef.current) {
            chatsLogRef.current.innerHTML += `
              <p style={{maxWidth: "15vw"}}>
                <b>${message.name}</b> :  ${message.message}
              </p>`;
          }
        });

        removeUser();
      });
  }, []);

  const addNewUser = (stream) => {
    userVideo.current.srcObject = stream;
    let video = userVideo.current;
    let initstream = video.srcObject;
    const videotrack = initstream.getVideoTracks()[0];
    const audiotrack = initstream.getAudioTracks()[0];
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
    socketRef.current.emit("join room", roomID, username);
    socketRef.current.on("all users", (users) => {
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

    // Existing Users recieve signal
    socketRef.current.on("user joined", (payload) => {
      const peer = addPeer(payload.signal, payload.callerID, stream);
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

  const toggleVideo = async () => {
    let video = userVideo.current;
    let stream = video.srcObject;
    const videotrack = stream.getVideoTracks()[0];
    videotrack.enabled = !videotrack.enabled;
    if (!VideoStreaming) {
      setVideoStreaming(true);
      // let video = userVideo.current;
      // let mainstream = video.srcObject;
      // let oldtrack = mainstream.getVideoTracks()[0];
      // navigator.mediaDevices
      //   .getUserMedia({ video: true, audio: AudioStreaming })
      //   .then((stream) => {
      //     const videoTrack = stream.getVideoTracks()[0];
      //     userVideo.current.srcObject = stream;
      //     if (peersRef.current) {
      //       peersRef.current.forEach((peer) => {
      //         peer.peer.replaceTrack(oldtrack, videoTrack, mainstream);
      //       });
      //       setPeers(peersRef.current);
      //     }
      //   });
    } else {
      setVideoStreaming(false);
      // let video = userVideo.current;
      // let videotrack = video.srcObject.getVideoTracks();
      // videotrack.stop();
      // let videoTrack = video.srcObject.getVideoTracks()[0];
      // videoTrack.stop();
      // await video.srcObject.getTracks()[l - 1].stop();
      // video.srcObject = null;
      // console.log(video.srcObject.getTracks());
    }
  };

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

  const toggleCutCall = () => {
    userVideo.current.srcObject.getVideoTracks()[0].stop();
    userVideo.current.srcObject.getAudioTracks()[0].stop();
    socketRef.current.emit("cut call");
    removeUser();
  };

  const toggleScreenShare = () => {
    if (!ScreenSharing) {
      setScreenSharing(true);
      navigator.mediaDevices
        .getDisplayMedia({ cursor: true })
        .then((stream) => {
          let screenShareTrack = stream.getVideoTracks()[0];
          userVideo.current.srcObject = stream;
          peerReplaceTrack(screenShareTrack);
          setPeers(peersRef.current);

          screenShareTrack.onended = () => {
            endScreenShare();
          };
        });
    } else {
      endScreenShare();
      setPeers(peersRef.current);
    }
  };

  const endScreenShare = () => {
    setScreenSharing(false);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        let newvidTrack = stream.getVideoTracks()[0];
        peerReplaceTrack(newvidTrack);
        userVideo.current.srcObject = stream;
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

  const toggleParticipants = () => {
    if (ParticipantsRef.current.style.display === "none") {
      if (chatRef.current.style.display === "block") {
        chatRef.current.style.display = "none";
      }
      if (AddParticipantRef.current.style.display === "block") {
        AddParticipantRef.current.style.display = "none";
      }
      ParticipantsRef.current.style.display = "block";
      socketRef.current.emit("display users");
      socketRef.current.on("all names", (names) => {
        // console.log(names);
        // return names;
        if (ParticipantsLogRef.current) {
          ParticipantsLogRef.current.innerHTML = null;
          names.forEach((name) => {
            ParticipantsLogRef.current.innerHTML += ` <p>${name}</p>`;
            console.log(name);
          });
        }
      });
      setVideosRightMargin(18);
      setMiniVideoRightMargin(0);
    } else {
      ParticipantsRef.current.style.display = "none";
      setVideosRightMargin(2);
      setMiniVideoRightMargin(8);
    }
  };

  const toggleAddParticipants = () => {
    if (chatRef.current.style.display === "block") {
      chatRef.current.style.display = "none";
    }
    if (ParticipantsRef.current.style.display === "block") {
      ParticipantsRef.current.style.display = "none";
    }
    if (AddParticipantRef.current.style.display === "none") {
      AddParticipantRef.current.style.display = "block";
      setVideosRightMargin(18);
      setMiniVideoRightMargin(0);
    } else {
      AddParticipantRef.current.style.display = "none";
      setVideosRightMargin(2);
      setMiniVideoRightMargin(8);
    }
  };

  const handleSendMessage = (message) => {
    if (message) {
      socketRef.current.emit("send message", message);
      if (chatsLogRef.current) {
        chatsLogRef.current.innerHTML += `
        <p style={{maxWidth: "15vw"}>
          <b>You</b> :  ${message}
        </p>`;
      }
    }
  };

  const toggleChat = () => {
    if (ParticipantsRef.current.style.display === "block") {
      ParticipantsRef.current.style.display = "none";
    }
    if (AddParticipantRef.current.style.display === "block") {
      AddParticipantRef.current.style.display = "none";
    }
    if (chatRef.current.style.display === "none") {
      chatRef.current.style.display = "block";
      setVideosRightMargin(18);
      setMiniVideoRightMargin(0);
    } else {
      chatRef.current.style.display = "none";
      setVideosRightMargin(2);
      setMiniVideoRightMargin(8);
    }
    // console.log(peersRef.current);
    // console.log(getName(peersRef.current[0].peerID));
  };

  const toggleFullScreen = () => {
    if (MaxScreenRef.current.style.display === "none") {
      MaxScreenRef.current.style.display = "inline-block";
      MinScreenRef.current.style.display = "none";
    } else {
      MaxScreenRef.current.style.display = "none";
      MinScreenRef.current.style.display = "inline-block";
    }
  };

  // const getName = async (id,ref) => {
  //   socketRef.current.emit("get name", id);
  //   await socketRef.current.on("fetch name", (currentname) => {
  //   });
  //   return Tempname;
  // };

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
          {peers.map((peer) => {
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
              // minHeight: `${videoparams(count).userheight * 0.5}vh`,
              width: `${videoparams(count).userwidth}vw`,
              // minWidth: `${videoparams(count).userwidth * 0.5}vh`,
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
