const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const socketHandler = require("./sockets/documentSocket");

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
  },
});

socketHandler(io);

pool
  .connect()
  .then(() => console.log("PostgreSQL Connected "))
  .catch((err) => console.error("DB Error", err));

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);

app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authenticated!", user: req.user });
});

app.get("/", (req, res) => {
  res.send("Server is running ");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
