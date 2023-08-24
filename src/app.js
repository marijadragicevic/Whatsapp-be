import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";
import createHttpError from "http-errors";
import routes from "./routes/index.js";

// dotenv config
dotenv.config();

// create express app
const app = express();

// morgan
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// helmet
app.use(helmet());

// parser json request url
app.use(express.json());

// parser json request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// enable cookie parser
app.use(cookieParser());

// gzip compression
app.use(compression());

// file upload
app.use(fileUpload({ useTempFiles: true }));

// cors
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// app v1 routes
app.use("/api/v1", routes);

// example api call
// app.post("/test", (request, response) => {
//   // request.files()
//   response.send(request.body);
//   // throw createHttpError.BadRequest("This route has a error.");
// });

app.use(async (request, response, next) => {
  next(createHttpError.NotFound("This route does not exist."));
});

// error handling
app.use(async (error, request, response, next) => {
  response.status(error.status || 500);
  response.send({
    error: {
      status: error.status || 500,
      message: error.message,
    },
  });
});

export default app;
