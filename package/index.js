import { createServer, get } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Schema } from "./models/chatShema.js";
import { MessageSchema } from "./models/chatShema.js";
import crypto from "crypto";
import "dotenv/config";

const PORT = 3000;
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

const generateID = () => crypto.randomUUID();
const getAllRooms = () => Schema.find({}, "id name messages").exec();
const getCurrentRoom = (id) => Schema.find({ id: id }).exec();
io.on("connection", async (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("getRoomList", async () => {
    const getRooms = await getAllRooms();
    socket.emit("roomsList", getRooms);
  });

  socket.on("joinRoom", async (id) => {
    socket.join(id);
    console.log(`User with id ${socket.id} join room: ${id}`);
  });

  socket.on("createRoom", async (name) => {
    console.log(`User with id ${socket.id} join room: ${name}`);
    const data = new Schema({
      id: generateID(),
      name,
    });

    await data.save();

    const getRooms = await getAllRooms();
    socket.to("chat").emit("roomsList", getRooms);
    socket.emit("createdRoom", data);
  });

  socket.on("leaveRoom", (id) => {
    socket.leave(id);
    console.log(`User ${socket.id} left room: ${id}`);
  });

  socket.on("findRoom", async (id) => {
    const currentRoom = await getCurrentRoom(id);
    socket.emit("foundRoom", currentRoom[0]);
  });

  socket.on("enterBuilding", () => {
    socket.join("chat");
  });

  socket.on("newMessage", async (data) => {
    const { room_id, message, user, time } = data;

    const currentRoom = await getCurrentRoom(room_id);

    if (!currentRoom) {
      console.error("Cannot find any rooms.");
      return false;
    }

    const newMessage = await MessageSchema.create({
      id: generateID(),
      text: message,
      user,
      time,
    });

    const hours = newMessage.createdAt.getHours();
    const minutes = newMessage.createdAt.getMinutes();
    newMessage.time = `${hours}:${minutes}`;

    currentRoom[0].messages.push(newMessage);
    await currentRoom[0].save();
    const updatedRoom = await getCurrentRoom(room_id);
    socket.to(currentRoom[0].name).emit("roomMessage", updatedRoom[0].messages);

    socket.emit("foundRoom", updatedRoom[0]);
  });

  socket.on("deleteRoom", async (id) => {
    await Schema.deleteOne({ id: id })
      .exec()
      .then(() => console.log("Room deleted", id));
    const getRooms = await Schema.find().exec();
    socket.emit("roomsList", getRooms);
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

app.get("/rooms", async (req, res) => {
  const aggregate = await Schema.aggregate([
    { $project: { id: 1, name: 1, messages: { $slice: ["$messages", -1] } } },
  ]).exec();

  res.json(aggregate);
});
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection error: ", err.message));

httpServer.listen(PORT, () => {
  console.log("server running at http://localhost:3000");
});
