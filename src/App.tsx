import Home from "./pages/Home/Home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import ChatRooms from "./pages/ChatRooms/ChatRooms";
import "./App.css";

import React, { useState } from "react";
import { IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import { Route, Redirect } from "react-router";

import { useSocket } from "./hooks/useSocket";
import ChatRoom from "./pages/ChatRoom/ChatRoom";

setupIonicReact();

function HomePage() {
  const [username, setUsername] = useState(
    localStorage.getItem("username") ?? ""
  );
  const {
    handleCreateChatRoom,

    handleJoinRoom,
    leaveRoom,
    logoutSocket,
  } = useSocket();

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Redirect exact path="/" to="/home" />
        {/*
          Use the render method to reduce the number of renders your component will have due to a route change.

          Use the component prop when your component depends on the RouterComponentProps passed in automatically.
        */}
        <Route
          path="/home"
          render={() => (
            <Home
              username={username}
              setUsername={setUsername}
              logoutSocket={logoutSocket}
            />
          )}
          exact={true}
        />

        <>
          <Route
            path="/chat/:id"
            render={() => (
              <ChatRoom
                handleJoinRoom={handleJoinRoom}
                leaveRoom={leaveRoom}
                username={username}
              />
            )}
            exact={true}
          />
          <Route
            path="/chat"
            render={() => (
              <ChatRooms
                handleCreateChatRoom={handleCreateChatRoom}
                username={username}
              />
            )}
            exact={true}
          />
        </>
      </IonRouterOutlet>
    </IonReactRouter>
  );
}
export default HomePage;
