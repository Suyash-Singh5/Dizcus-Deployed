import React from "react";
import logo from "../Images/logo.png";
import { Fade } from "react-awesome-reveal";
import NavBar from "../Components/NavBar";
import "../Room.css";
const About = () => {
  const style = {
    color: "#00e6ff",
    textAlign: "left",
    width: "60vw",
    position: "relative",
    top: "8vh",
    left: "20vw",
    fontSize: "1.5vw",
    backgroundColor: "rgba(87, 7, 86, 0.7)",
    paddingLeft: "2vw",
    paddingRight: "2vw",
    paddingTop: "1vw",
    paddingBottom: "1vw",
    borderRadius: "2vw",
  };
  return (
    <div
      className="newroom"
      style={{
        backgroundImage: `url(https://pavbca.com/walldb/original/d/e/1/181669.jpg)`,
      }}
    >
      <NavBar />
      <Fade duration="2000">
        <img className="about-logo" src={logo} alt="logo" />
      </Fade>
      <Fade duration="2000">
        <div style={style}>
          Hi ! This application is a part of the Microsoft's Engage Mentorship
          program, This application helps users to Video call and/or Chat with
          multiple people in custom rooms, It uses the peer to peer network type
          to establish connection between 2 users and the mesh topology to scale
          to multiple users, The best thing is the fact that no expensive server
          or communication service is required but this limits the scalability.
          <br />
          This application is built using the technology stack: React and Nodejs
          with WebRTC, SimplePeer and Socket.io for communication.. Open Sourced
          at
          {"   "}
          <a href="https://github.com/Suyash-Singh5/Dizcus-Deployed">Github</a>
        </div>
      </Fade>
    </div>
  );
};

export default About;
