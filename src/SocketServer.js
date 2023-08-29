export default function (socket) {
  // user joins or opens the application
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  // join a conversation room
  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
  });
}
