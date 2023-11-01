import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { IonButton, IonContent, IonPage } from "@ionic/react";
import Form from "../../components/Form/Form";
import "./Home.css";
import Layout from "../../components/Layout/Layout";
import { useHistory } from "react-router";
import { getSocketInstance } from "../../utils/socketInstance";

const Home = ({
  username,
  setUsername,
}: {
  logoutSocket: () => void;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
}) => {
  const socketInstance = getSocketInstance();
  const [value, setValue] = useState("");
  const history = useHistory();

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    setUsername(value);
    localStorage.setItem("username", value);
    history.push("/chat");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <IonPage>
      <Layout title="Home">
        <IonContent fullscreen>
          {username ? (
            <>
              <p>Welcome {username}</p>
              <IonButton
                onClick={() => {
                  socketInstance.emit("enterBuilding", "chat");
                  history.push("/chat");
                }}
              >
                Chat
              </IonButton>
            </>
          ) : (
            <Form
              placeholder="Username"
              onChange={onChange}
              onSubmit={submitHandler}
            />
          )}
        </IonContent>
      </Layout>
    </IonPage>
  );
};

export default Home;
