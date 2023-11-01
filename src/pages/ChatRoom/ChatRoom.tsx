import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  IonBackButton,
  IonButtons,
  IonFooter,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import Layout from "../../components/Layout/Layout";
import { useParams } from "react-router";
import styles from "./ChatRoom.module.css";
import { getSocketInstance } from "../../utils/socketInstance";
import { IMessage, IMessageContent, IRoom } from "../../types/Interfaces";

interface IChatRoom {
  handleJoinRoom: (name: string) => void;
  leaveRoom: (name: string) => void;
  username: string;
}

const ChatRoom = ({ handleJoinRoom, leaveRoom, username }: IChatRoom) => {
  const bottomRef = useRef<null | HTMLDivElement>(null);
  const socketInstance = useMemo(() => getSocketInstance(), []);

  const [currentMessage, setCurrentMessage] = useState("");
  const [room, setRoom] = useState<IRoom | null>(null);
  const roomName = useMemo(() => room?.name, [room]);
  const { id } = useParams<{ id: string }>();

  const getRoom = async () => {
    socketInstance.emit("findRoom", id);
  };

  useEffect(() => {
    getRoom();

    socketInstance.on("foundRoom", (data) => {
      if (!room) {
        setRoom(data);
        handleJoinRoom(data.name);
      }
      setRoom(data);
    });

    socketInstance.on("roomMessage", (data: IMessage[]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setRoom((prevState: IRoom | null): any => {
        return {
          ...prevState,
          messages: data,
        };
      });
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room]);

  useEffect(() => {
    return () => {
      if (!roomName) return;
      leaveRoom(roomName);
    };
  }, []);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room_id: id,
        user: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      socketInstance.emit("newMessage", messageData);
      setCurrentMessage("");
    }
  };

  return (
    <IonPage>
      <Layout
        title={room?.name}
        username={username}
        toolbarButton={() => {
          return (
            <IonButtons slot="start">
              <IonBackButton defaultHref="/chat"></IonBackButton>
            </IonButtons>
          );
        }}
      >
        <div style={{ height: "100vh" }}>
          <div className="chat-window">
            <div className="chat-body">
              <div className="message-container">
                {room?.messages.map((messageContent: IMessageContent) => {
                  return (
                    <div
                      key={messageContent.id}
                      className="message"
                      id={username === messageContent?.user ? "you" : "other"}
                    >
                      <div>
                        <div className="message-content">
                          <p>{messageContent?.text}</p>
                        </div>
                        <div className="message-meta">
                          <p id="time">{messageContent?.time}</p>
                          <p id="author">{messageContent?.user}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            </div>
          </div>
          <IonFooter>
            <IonToolbar>
              <div className={styles.sendMessageWrapper}>
                <textarea
                  value={currentMessage}
                  placeholder=""
                  onChange={(event) => {
                    setCurrentMessage(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    sendMessage();
                  }}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </IonToolbar>
          </IonFooter>
        </div>
      </Layout>
    </IonPage>
  );
};

export default ChatRoom;
