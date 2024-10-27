/**
 * server.js
 *
 * THIS PROJECT USES ES MODULE FORMAT, i.e import statements instead of require statements. If you use require statements it will give you error.
 *
 * This file sets up and starts the Express server for the application.
 * It initializes the server, configures middleware for handling JSON
 * and URL-encoded request bodies, and sets up API routes for handling
 * authentication-related endpoints.
 *
 * Use Case:
 * - This server listens on port 8080 (though the log message mistakenly
 *   says port 3000) and provides the endpoint `/auth` for authentication
 *   functionalities.
 * - Middleware is used to parse incoming request bodies, which is necessary
 *   for processing POST requests with JSON data or URL-encoded form data.
 * - Environment variables are loaded using `dotenv` to manage configuration
 *   settings.
 *
 * To run the server, use `node server.js` or `nodemon server.js`.
 */

//Import Statements
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./Routes/authRoutes.js";
import classRoutes from "./Routes/classRoutes.js";
import connect from "./config/db.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import dataRoutes from "./Routes/dataRoutes.js";
import assignmentRoutes from "./Routes/AssignmentRoutes.js";
import messagesRoutes from "./Routes/messageRoutes.js";
import { sendRoomMessage } from "./Controllers/messageControllers.js";
dotenv.config(); // for parsing env files

const app = express();

console.log(process.env.CLIENT);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// CORS options
const corsOptions = {
  credentials: true,
  origin: process.env.CLIENT,
};
app.use(cors(corsOptions));

// CORS options

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB
connect();

const server = http.createServer(app);
const io = new Server(server, { cors: { ...corsOptions } });

// API routes for APP
app.use("/auth", authRoutes);
app.use("/data", dataRoutes);
app.use("/class", classRoutes);
app.use("/assignment", assignmentRoutes);
// app.use("/messages", messagesRoutes)

// Socket.io setup and related Instances

const userSockets = {};
io.on("connection", (socket) => {
  //For joining room
  socket.on("joinRoom", ({ roomId, socketId, id }) => {
    socket.join(roomId);
    userSockets[id] = socketId;
  });

  //for message related instance
  socket.on("message", (message) => {
    console.log("New message:", message);
    io.to(message.roomId).emit("roomMsg", {
      message: message.message,
      sender: { email: message.senderEmail },
    });
    sendRoomMessage(message);
  });

  //for notification related instance
  socket.on("notification", (notification) => {
    const user = userSockets[notification.userId];
    if (user) {
      io.to(user).emit("notification", notification);
    } else {
      console.log("User not found:", notification.userId);
    }
  });
  //for disconnecting from room
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
// Starting the server on port 8080
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
