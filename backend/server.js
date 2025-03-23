import express from "express";
import cors from "cors";
import downloadRoutes from "./routes/downloadRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { authMiddleware } from "./middlewares/index.js";
import dotenv from "dotenv";
import { connectDB } from "./database/index.js";
import cookiesParser from "cookie-parser";

dotenv.config({
  path: "./config/config.env"
});
dotenv.configDotenv({
  path: "./config/config.env"
});

const app = express();

app.use(express.json());
app.use(cookiesParser());
app.use(
  cors({
    origin: "*"
  })
);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use("/api/users", userRoutes);
app.use("/api/download", authMiddleware, downloadRoutes);

const port = process.env.PORT || 5000;

// connect database
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at ${port}`);
    });
  })
  .catch(error => {
    console.log("Database connection failed! at server", error);
    process.exit(1); // Exit the process with an error code
  });
