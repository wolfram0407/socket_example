import express from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { addUser, generateMessage, getUsersInRoom, getUser, removeUser } from "./utils/users.js";
import { fileURLToPath } from "url";

const currentModuleURL = import.meta.url;
const currentModulePath = fileURLToPath(currentModuleURL);

const app = express();

const server = http.createServer(app);
const io = new Server(server);
const port = 4000;
path.join(currentModulePath, "../public");

app.use(express.static(path.join(currentModulePath, "../public")));

io.on("connection", (socket) => {
  console.log(`New WebSocket ${socket.id} connected`);

  socket.on("join", (options, callback) => {
    console.log("options, callback", options, callback);
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.broadcast.to(user.room).emit("message", generateMessage(`${user.username}가 방에 참여했습니다.`));

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback();
  });

  socket.on("disconnect", () => {
    console.log(`WebSocket ${socket.id} disconnected`);
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", generateMessage("Admin", `${user.username}가 방을 나갔습니다.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
