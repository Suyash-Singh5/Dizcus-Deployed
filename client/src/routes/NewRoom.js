import React from "react";
import { v1 } from "uuid";
import NavBar from "../Components/NavBar";
import bg from "../Images/newroombg.jpg";

export const NewRoom = (props) => {
  const style = {
    opacity: "80%",
    backgroundColor: "rgb(6 66 140)",
    color: "white",
    width: "20vw",
    height: "10vw",
    fontSize: "2.5vw",
    cursor: "pointer",
    top: "50vh",
    left: "40vw",
    position: "absolute",
    border: "2px solid rgb(0 255 187)",
    borderRadius: "20px",
    // shadow: "4px",
    backgroundImage: "none",
    ":hover": {
      backgroundColor: "red",
    },
  };

  const style2 = {
    backgroundImage: { bg },
  };

  function createID() {
    const id = v1();
    props.history.push(`/${id}`);
  }

  return (
    <div className="newroom" style={{ backgroundImage: `url(${bg})` }}>
      <NavBar />
      <p
        style={{
          color: "white",
          top: "10vh",
          textAlign: "center",
          position: "relative",
          fontSize: "3vw",
          // backgroundImage: "none",
          backgroundColor: "none",
        }}
      >
        Welcome to the website
      </p>

      <button style={style} onClick={createID}>
        Create A New Room
      </button>
    </div>
  );
};

export default NewRoom;
