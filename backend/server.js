const dotenv = require('dotenv');
dotenv.config(); // Load environment variables first

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const { notFound, errorHandler } = require('./Middleware/errorMiddleware');

connectDB(); // Connect to MongoDB

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Allow JSON parsing

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "Frontend", "dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname1, "Frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);

// SOCKET.IO SETUP
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to Socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected"); // Fixed extra space in string
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("send Message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id !== newMessageRecieved.sender._id) {
        socket.in(user._id).emit("message received", newMessageRecieved);
      }
    });
  });
});
