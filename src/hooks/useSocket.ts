import { useEffect, FormEvent } from "react";
import { getSocketInstance } from "../utils/socketInstance";

const socketInstance = getSocketInstance();

export const useSocket = () => {
  useEffect(() => {
    // listen for events emitted by the server

    socketInstance.on("connect", () => {
      console.log("Connected to server");
    });

    socketInstance.on("message", (data: string) => {
      console.log(`Received message: ${data}`);
    });

    // return () => {
    //   if (socketInstance) {
    //     socketInstance.disconnect();
    //   }
    // };
  }, []);

  const handleSubmitMessage = (event: FormEvent) => {
    event.preventDefault();
    const message = ""; // get message from input field or state

    if (socketInstance && message) {
      socketInstance.emit("new-message", message);
    }
  };

  const handleCreateChatRoom = async (data: string) => {
    if (socketInstance) {
      socketInstance.emit("createRoom", data);
    }
  };

  const handleJoinRoom = (data: string) => {
    if (socketInstance) {
      socketInstance.emit("joinRoom", data);
    }
  };

  const leaveRoom = (id: string) => {
    if (socketInstance && id) {
      socketInstance.emit("leaveRoom", id);
    }
  };

  const deleteRoom = (id: string) => {
    socketInstance.emit("deleteRoom", id);
  };

  const logoutSocket = () => {
    if (socketInstance) {
      socketInstance.disconnect();
    }
  };

  return {
    handleSubmitMessage,
    handleCreateChatRoom,
    handleJoinRoom,
    leaveRoom,
    logoutSocket,
    deleteRoom,
  };
};
