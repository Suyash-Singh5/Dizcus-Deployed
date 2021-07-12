import React from "react";
import NavBar from "../Components/NavBar";

const ContactUs = () => {
  return (
    <div
      className="newroom"
      style={{
        backgroundImage: `url(https://pavbca.com/walldb/original/d/e/1/181669.jpg)`,
      }}
    >
      <NavBar />
      <div style={{ fontSize: "3vw", color: "yellow", textAlign: "center" }}>
        Lets Share Some Ideas !
      </div>
      <div
        style={{
          fontSize: "2vw",
          color: "white",
          marginLeft: "20vw",
          marginTop: "3vw",
        }}
      >
        Mail me at:
        <ul>
          <li>
            <a href="mailto: singh.83@iitj.ac.in">singh.83@iitj.ac.in</a>
          </li>
          <li>
            <a href="mailto: suyash.s.singh5@gmail.com">
              suyash.s.singh5@gmail.com
            </a>
          </li>
        </ul>
      </div>
      <div
        style={{
          fontSize: "2vw",
          color: "white",
          marginLeft: "20vw",
          marginTop: "3vw",
        }}
      >
        Github:
        <div>
          <a href="https://github.com/Suyash-Singh5">Github</a>
        </div>
      </div>
      <div
        style={{
          fontSize: "2vw",
          color: "white",
          marginLeft: "20vw",
          marginTop: "3vw",
        }}
      >
        LinkedIn:
        <div>
          <a href="https://www.linkedin.com/in/suyash-singh-3192991aa/">
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
