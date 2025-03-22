import express from "express";
import cors from "cors";
import downloadRouter from "./routes.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin:"*"
}));

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use("/api/download", downloadRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
