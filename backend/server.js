const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// DB
const connectDB = require("./config/db");

// MIDDLEWARES
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// CONNECT DB
connectDB();

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// SOCKET
const { initSocket } = require("./sockets");
initSocket(server);

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));   // ✅ ADD THIS
app.use("/api/notes", require("./routes/noteRoutes"));

// SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});