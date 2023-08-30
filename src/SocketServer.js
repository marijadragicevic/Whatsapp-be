let onlineUsers = [];

export default function (socket, io) {
  // user joins or opens the application
  socket.on("join", (userId) => {
    socket.join(userId);

    // add online user to online users
    if (!onlineUsers?.some((user) => user?.userId === userId)) {
      console.log("User is now online");
      onlineUsers?.push({ userId, socketId: socket.id });
    }

    // send online users to frontend
    socket.emit("get-online-users", onlineUsers);
  });

  // socket  disconnect
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers?.filter((user) => user.socketId !== socket.id);
    console.log("User has just disconnected");
    io.emit("get-online-users", onlineUsers);
  });

  // join a conversation room
  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
  });

  // send and receive message
  socket.on("send message", (message) => {
    let conversation = message.conversation;

    if (!conversation.users) return;

    conversation?.users.forEach((user) => {
      if (user._id === message.sender._id) return;

      // socket.in(room) same as socket.to(room)
      socket.in(user._id).emit("receive message", message);
    });
  });
}
