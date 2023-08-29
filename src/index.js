import mongoose from "mongoose";
import { Server } from "socket.io";
import app from "./app.js";
import logger from "./configs/logger.config.js";
import SocketServer from "./SocketServer.js";

// env variables
const { DATABASE_URL, CLIENT_ENDPOINT } = process.env;
const PORT = process.env.PORT || 8000;

// exit on mongodb error
mongoose.connection.on("error", (error) => {
  logger.error(`Mongodb connection error: ${error}`);
  process.exit(1);
});

// mongodb debug mode
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

// mongodb connection
mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    logger.info("Connected to MongoDB.");
  });
let server;

server = app.listen(PORT, () => {
  logger.info(`server is listening at ${PORT}`);
});

// socket io
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: CLIENT_ENDPOINT,
  },
});

// handle server errors
const exitHandler = () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

io.on("connection", (socket) => {
  logger.info("Socket io connected successfully");
  SocketServer(socket);
});

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

// sigterm
process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  }
});
