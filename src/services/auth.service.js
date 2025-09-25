import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/User.js";
import { hashPassword, verifyPassword, randomToken } from "../utils/crypto.js";
import { AppError } from "../utils/error.js";
import { sendMail } from "./email.service.js";

function sign(userId) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: "7d" });
}

export async function register({ email, password, name }) {
  const exists = await User.findOne({ email });
  if (exists) throw new AppError(409, "Email already registered");
  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash, name });
  const token = sign(user._id.toString());
  return { token };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(401, "Invalid credentials");
  const checked = await verifyPassword(password, user.passwordHash);
  if (!checked) throw new AppError(401, "Invalid credentials");
  const token = sign(user._id.toString());
  return { token, user: { id: user._id, email: user.email, name: user.name } };
}

export async function forgotPassword(email) {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(404, "User not found");
  user.resetToken = randomToken();
  user.resetTokenExp = new Date(Date.now() + 1000 * 60 * 30); // 30 min
  await user.save();
  await sendMail({
    to: email,
    subject: "Password reset",
    text: `Your token: ${user.resetToken}`
  });
}

export async function resetPassword({ token, newPassword }) {
  const user = await User.findOne({ resetToken: token, resetTokenExp: { $gt: new Date() } });
  if (!user) throw new AppError(400, "Invalid or expired token");
  user.passwordHash = await hashPassword(newPassword);
  user.resetToken = undefined;
  user.resetTokenExp = undefined;
  await user.save();
  return true;
}
