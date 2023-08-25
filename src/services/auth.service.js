import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import validator from "validator";
import { UserModel } from "../models/index.js";

// env variables
const { DEFAULT_STATUS, DEFAULT_PICTURE } = process.env;

export const createUser = async (userData) => {
  const { name, email, picture, status, password } = userData;

  // check if field are empty
  if (!name || !email || !password) {
    throw createHttpError.BadRequest("Please fill all fields.");
  }

  // check name length
  if (!validator.isLength(name, { min: 2, max: 16 })) {
    throw createHttpError.BadRequest(
      "Please make sure your name is between 2 and 16 characters."
    );
  }

  //check status length
  if (status && status?.length > 64) {
    throw createHttpError.BadRequest(
      "Please make sure your status is less than 64 characters."
    );
  }

  // check if email address is valid
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest(
      "Please make sure to provide a valid email address."
    );
  }

  // check if user already exist
  const checkDb = await UserModel.findOne({ email });

  if (checkDb) {
    throw createHttpError.Conflict(
      "Please try again with different email address, this email already exist."
    );
  }

  // check password length
  if (!validator.isLength(password, { min: 6, max: 128 })) {
    throw createHttpError.BadRequest(
      "Please make sure your password is between 6 and 128 characters."
    );
  }

  // hash password ---> to be done in user model
  // add a user to data base
  const user = await new UserModel({
    name,
    email,
    password,
    picture: picture || DEFAULT_PICTURE,
    status: status || DEFAULT_STATUS,
  }).save();

  return user;
};

export const signUser = async (email, password) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();

  // check if user exist
  if (!user) throw createHttpError.NotFound("Invalid credentials.");

  //compare passwords
  let passwordMathces = await bcrypt.compare(password, user.password);

  if (!passwordMathces) throw createHttpError.NotFound("Invalid credentials.");

  return user;
};
