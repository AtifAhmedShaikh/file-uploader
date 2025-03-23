import { UserModel } from "../models/UserModel.js";
import Jwt from "jsonwebtoken"

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies?.token|| req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });
  
    try {
      console.log(process.env.JWT_SECRET_KEY)
      const decoded = Jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user= await UserModel.findById(decoded?.id).select("-password");
      if(!user){
        return res.status(401).json({ message: "User not found" });
      }
      req.user =user;
      next(); 
    } catch (error) {
      console.log(error)
      res.status(401).json({ message: "Invalid token" });
    }
  };
