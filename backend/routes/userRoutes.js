import express from "express";
import { registerUserController, userLoginController } from "../controllers/userController.js";
import { UserModel } from "../models/UserModel.js";

const router = express.Router();

router.post("/login", userLoginController);


router.post("/register", registerUserController);

export default router;
