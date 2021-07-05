import React from "react";
import logo from "../Images/logo.png";
import bg from "../Images/newroombg.jpg";
import NavBar from "../Components/NavBar";
import "../Room.css";
const About = () => {
  const style = {
    color: "white",
    textAlign: "center",
    width: "60vw",
    position: "relative",
    top: "8vh",
    left: "20vw",
    fontSize: "2.8vh",
    backgroundColor: "rgba(56, 7, 86, 0.7)",
  };
  return (
    <div className="newroom" style={{ backgroundImage: `url(${bg})` }}>
      <NavBar />
      <img className="about-logo" src={logo} alt="logo" />
      <p style={style}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam quasi
        pariatur inventore quas officiis accusantium? Hic vitae aliquam
        cupiditate consequatur iusto fugiat, dolor quidem enim commodi harum
        necessitatibus expedita. Facilis! Veritatis dolorem dolores voluptatem,
        hic enim atque id at distinctio! Similique soluta praesentium iste
        perferendis sint architecto voluptas, magni aperiam illo earum velit
        magnam voluptates ratione asperiores voluptatem eius a? Fugiat itaque
        laborum ea est possimus commodi similique a accusamus nam eligendi ipsam
        vero libero, eos eius? Asperiores quisquam impedit sit, culpa molestias
        ea cumque velit quae fugit odio. Accusamus. Voluptates fugiat id facilis
        error! Placeat velit tempore hic expedita vero aut. Repellat rerum
        nulla, odio perferendis tenetur id earum nam reprehenderit enim deleniti
        dicta quod qui, ducimus, unde ullam.
      </p>
    </div>
  );
};

export default About;
