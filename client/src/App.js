import React from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Room from "./routes/Room";
import NewRoom from "./routes/NewRoom";
import PreRoom from "./routes/PreRoom";
import About from "./routes/About";
import ChatRoom from "./routes/ChatRoom";
import JoinMeeting from "./routes/JoinMeeting";
import ContactUs from "./routes/ContactUs";

const App = () => {
  
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/" exact component={NewRoom} />
          <Route path="/about" component={About} />
          <Route path="/:roomID/video" exact component={PreRoom} />
          <Route path="/:roomID/video/join" exact component={Room} />
          <Route path="/:roomID/chat" exact component={ChatRoom} />
          <Route path="/joinMeeting" exact component={JoinMeeting} />
          <Route path="/contactUs" exact component={ContactUs} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
