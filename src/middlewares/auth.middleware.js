import { verifyToken } from "../utils/jwt.js";

export default (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).json({
        success: false,
        message: "Token Tidak Tersedia!",
        data: null,
      });
    }
    const [prefix, token] = authorization.split(" ");
    if (!(prefix === "Bearer" && token)) {
      return res.status(403).json({
        success: false,
        message: "Token Tidak Tersedia",
        data: null,
      });
    }
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: error.message, data: null });
  }
};
