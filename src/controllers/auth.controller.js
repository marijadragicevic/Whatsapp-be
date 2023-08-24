import createHttpError from "http-errors";
import { createUser, signUser } from "../services/auth.service.js";
import { generateToken, verifyToken } from "../services/token.service.js";
import { findUser } from "../services/user.service.js";

export const register = async (request, response, next) => {
  try {
    const { name, email, picture, status, password } = request.body;

    // id field is generated when we add to db
    const newUser = await createUser({
      name,
      email,
      picture,
      status,
      password,
    });

    const access_token = await generateToken(
      { userId: newUser._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    const refresh_token = await generateToken(
      { userId: newUser._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

    response.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      path: "/api/v1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    response.json({
      message: "Register success.",
      access_token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        status: newUser.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const user = await signUser(email, password);
    const access_token = await generateToken(
      { userId: user._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    const refresh_token = await generateToken(
      { userId: user._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

    response.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      path: "/api/v1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    response.json({
      message: "Successfully logged in.",
      access_token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (request, response, next) => {
  try {
    response.clearCookie("refreshToken", {
      path: "/api/v1/auth/refreshtoken",
    });
    response.json({
      message: "Successfully logged out.",
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (request, response, next) => {
  try {
    const refresh_token = request.cookies.refreshToken;

    if (!refresh_token) throw createHttpError.Unauthorized("Please login.");

    const check = await verifyToken(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await findUser(check.userId);

    const access_token = await generateToken(
      { userId: user._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    response.json({
      // message: "refresh token",
      access_token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
