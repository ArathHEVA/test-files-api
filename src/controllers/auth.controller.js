import * as Auth from "../services/auth.service.js";

export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    const response = await Auth.register({ email, password, name });
    res.status(201).send({
      success: true,
      message: "User registered successfully",
      data: response
    });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const response = await Auth.login({ email, password });
    res.status(200).send({
      success: true,
      message: "User logged in successfully",
      data: response
    });
  } catch (err) { next(err); }
}

export async function forgot(req, res, next) {
  try {
    const { email } = req.body;
    await Auth.forgotPassword(email);
    res.status(200).send({
      success: true,
      message: "Password reset email sent successfully",
      data:null
    });
  } catch (err) { next(err); }
}

export async function reset(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    await Auth.resetPassword({ token, newPassword });
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
      data:null
    });
  } catch (err) { next(err); }
}
