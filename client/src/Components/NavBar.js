import React from "react";
import brand from "../Images/brandfinal-bg.png";
import logo from "../Images/logo.png";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark nav">
        <div className="container-fluid">
          <Link to="/">
            <div className="navbar-brand">
              <img src={logo} className="App-logo" alt="logo" />
            </div>
          </Link>
          <Link to="/">
            <div className="navbar-brand">
              <img src={brand} className="App-brand" alt="brand" />
            </div>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  to="/"
                  style={{
                    textDecoration: "none",
                    color: "rgba(244,183,40,1)",
                  }}
                >
                  <div>Home</div>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/about"
                  style={{
                    textDecoration: "none",
                    color: "rgba(244,183,40,1)",
                  }}
                >
                  <div>About</div>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/"
                  style={{
                    textDecoration: "none",
                    color: "rgba(244,183,40,1)",
                  }}
                >
                  <div>Join Meeting</div>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/"
                  style={{
                    textDecoration: "none",
                    color: "rgba(255,255,0,0.8)",
                  }}
                >
                  <div className="contact">Contact Us</div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
