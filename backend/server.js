import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();
await connectDB();

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "*" },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  socket.on("join_room", (roomId) => socket.join(roomId));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`LifeLink server running on ${PORT}`);
});