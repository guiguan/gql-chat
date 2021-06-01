import { useState } from "react";
import {
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import {
  Card,
} from "ui-neumorphism";
import "ui-neumorphism/dist/index.css";
import Chat from '../chat/Chat';
import Register from '../register/Register';
import './App.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  const query = useQuery();

  const [email, setEmail] = useState(query.get("email") || "");
  const [name, setName] = useState(query.get("name") || "");

  return (
    <main className="theme--light">
      <Card flat className="main-container">
        <Switch>
          <Route path="/chat">
            {email ?
              <Chat
                email={email}
              /> : <Redirect to="/" />}
          </Route>
          <Route path="/">
            <Register
              email={email}
              setEmail={setEmail}
              name={name}
              setName={setName}
            />
          </Route>
        </Switch>
      </Card >
    </main >
  );
}

export default App;
