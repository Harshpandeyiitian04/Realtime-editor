const activeUsers = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("join-document", ({ documentId, user }) => {
      socket.join(documentId);

      if (!activeUsers[documentId]) {
        activeUsers[documentId] = [];
      }

      activeUsers[documentId].push({
        socketId: socket.id,
        email: user.email,
        role: user.role,
      });

      io.to(documentId).emit("active-users", activeUsers[documentId]);
    });

    socket.on("disconnect", () => {
      for (const docId in activeUsers) {
        activeUsers[docId] = activeUsers[docId].filter(
          (u) => u.socketId !== socket.id,
        );

        io.to(docId).emit("active-users", activeUsers[docId]);
      }
    });

    socket.on("cursor-move", ({ documentId, email }) => {
      socket.to(documentId).emit("cursor-update", email);
    });
  });
};
