import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { AppError } from "../utils/error.js";
import User from "../models/User.js";

export async function auth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw new AppError(401, "Missing token");
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.sub).lean();
    if (!user) throw new AppError(401, "Invalid token");
    req.user = { id: user._id, email: user.email };
    next();
  } catch (err) {
    next(new AppError(401, "Unauthorized"));
  }
}
