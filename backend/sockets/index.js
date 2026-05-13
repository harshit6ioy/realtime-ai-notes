const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ✅ USER ROOM
    socket.on("joinUserRoom", (userId) => {
      socket.join(userId);
      console.log(`User ${socket.id} joined room ${userId}`);
    });

    // ✅ NOTE ROOM (NEW)
    socket.on("joinNoteRoom", (noteId) => {
      socket.join(noteId);
      console.log(`User ${socket.id} joined note ${noteId}`);
    });

    // ✅ CURSOR MOVE
    socket.on("cursorMove", (data) => {
      const { roomId, x, y, userId, userName } = data || {};

      if (!roomId || x === undefined || y === undefined) return;

      socket.to(roomId).emit("cursorMove", {
        x,
        y,
        userId,
        userName,
        socketId: socket.id,
      });
    });

    // ✅ NOTE CONTENT CHANGE
    socket.on("noteContentChange", (data) => {
      const { roomId, content } = data || {};
      if (!roomId) return;
      socket.to(roomId).emit("noteContentChange", content);
    });

    // ✅ DISCONNECT
    socket.on("disconnecting", () => {
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.to(room).emit("userDisconnected", socket.id);
        }
      });

      console.log("User disconnected:", socket.id);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
};