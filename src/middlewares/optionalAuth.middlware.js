import { verifyToken } from "../utils/jwt.js";

export default function optionalAuth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch {
        req.user = null;
    }

    next();
}