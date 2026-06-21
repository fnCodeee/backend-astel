import jwt from "jsonwebtoken";
import { SECRET } from "./env.js";

export const generateToken = (user) => {
  const token = jwt.sign({ id: user.id }, SECRET, {
    expiresIn: "3d",
  });
  return token;
};

export const verifyToken = (token) => {
  const user = jwt.verify(token, SECRET);
  return user;
};
