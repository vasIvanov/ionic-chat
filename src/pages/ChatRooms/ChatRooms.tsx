import React, { useEffect, useState } from "react";
import { IonButton, IonButtons, IonPage } from "@ionic/react";
import Layout from "../../components/Layout/Layout";
import Form from "../../components/Form/Form";
import List from "../../components/List/List";
import { useHistory } from "react-router";
import { getRooms } from "../../services/getRooms";
import { getSocketInstance } from "../../utils/socketInstance";
import { IRoom } from "../../types/Interfaces";

const ChatRooms = ({
  handleCreateChatRoom,
}: {
  handleCreateChatRoom: (name: string) => void;
  username: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const socketInstance = getSocketInstance();
  const [roomName, setRoomName] = useState("");
  const history = useHistory();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const [rooms, setRooms] = useState<IRoom[] | null>(null);

  useEffect(() => {
    getRooms().then((data) => setRooms(data));

    socketInstance.on("roomsList", (data) => {
      setRooms(data);
    });

    socketInstance.on("createdRoom", (data) => {
      history.push(`/chat/${data.id}`);
    });
  }, []);

  return (
    <IonPage>
      <Layout
        // {...(username && {
        //   toolbarButton: () => (
        //     <IonButtons slot="end">
        //       <IonButton
        //         onClick={() => {
        //           // logoutSocket();
        //           setUsername("");
        //           history.push("/");
        //         }}
        //       >
        //         Logout
        //       </IonButton>
        //     </IonButtons>
        //   ),
        // })}
        toolbarButton={() => {
          return (
            <>
              <IonButtons slot="start">
                <IonButton routerLink="/">Home</IonButton>
              </IonButtons>
              <IonButtons slot="end">
                <IonButton
                  onClick={() => {
                    isOpen ? setIsOpen(false) : setIsOpen(true);
                  }}
                >
                  {isOpen ? "Cancel" : "+ Add Room"}
                </IonButton>
              </IonButtons>
            </>
          );
        }}
      >
        <>
          {isOpen ? (
            <Form
              placeholder="Name"
              onChange={onChange}
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateChatRoom(roomName);
              }}
            />
          ) : (
            <List items={rooms} />
          )}
        </>
      </Layout>
    </IonPage>
  );
};

export default ChatRooms;
