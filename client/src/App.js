import React from "react";
import { BrowserRouter as Router, Route, Switch, useRouteMatch} from "react-router-dom";
// import CreateRoom from "./routes/CreateRoom";
import Room from "./routes/Room";
import NewRoom from "./routes/NewRoom";
import PreRoom from "./routes/PreRoom";
import About from "./routes/About";

const App = () => {
  
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/" exact component={NewRoom} />
          <Route path="/about" component={About} />
          <Route path="/:roomID" exact component={PreRoom} />
          <Route path="/:roomID/join" exact component={Room} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
