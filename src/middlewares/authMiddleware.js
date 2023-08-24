import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

export default async (request, response, next) => {
  if (!request.headers["authorization"])
    return next(createHttpError.Unauthorized());

  const bearerToken = request.headers["authorization"];
  const token = bearerToken?.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
    if (error) {
      return next(createHttpError.Unauthorized());
    }

    request.user = payload;
    next();
  });
};
