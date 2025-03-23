import { UserModel } from "../models/UserModel.js";
import Jwt from "jsonwebtoken";

export const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatchedPassword = await user.comparePassword(password);
    if (!isMatchedPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "2d" });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await UserModel.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    user = await UserModel.create({ username: name, email, password });

    res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
