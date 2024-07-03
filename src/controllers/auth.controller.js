import {
  register,
  login,
  logout,
  changePassword,
  validateToken,
} from "../services/auth.service.js";
import { validationResult } from "express-validator";

export const registerController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error(`Validation failed`);
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }
    const userData = {
      username: req.body.username,
      email: req.body.email,
      full_name: req.body.full_name,
      password: req.body.password,
    };
    const response = await register(userData);
    res.status(201).send(response);
  } catch (err) {
    console.log(err);
    res.status(err.statusCode ?? 500);
    res.status(500).send({ error: "Failed to register: " + err });
  }
};

export const loginController = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // console.log(errors);
    // if (!errors.isEmpty()) {
    //   const err = new Error(`Validation failed`);
    //   err.statusCode = 422;
    //   err.data = errors.array();
    //   throw err;
    // }
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode ?? 500).send({ message: err.data });
  }

  try {
		const user = await login(req.body.username, req.body.password);
    res.status(200).send(user)
  } catch (error) {
    res.status(500).send({ error: "Failed to login: " + error });
  }
};

export const validateTokenController = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await validateToken(userId);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ error: "Failed to get user: " + error });
  }
};

export const logoutController = async (req, res) => {
	const accessToken = req.headers["x-access-token"];
  try {
    const response = await logout(accessToken);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ error: "Failed to logout: " + error });
  }
};

export const changePasswordController = async (req, res) => {
  const userId = req.userId;
  try {
    const response = await changePassword(
      userId,
      req.body.old_password,
      req.body.new_password
    );
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ error: "Failed to change password: " + error });
  }
};
