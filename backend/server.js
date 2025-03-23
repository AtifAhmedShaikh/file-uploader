import express from "express";
import cors from "cors";
import downloadRouter from "./routes.js";

const app = express();

app.use(express.json());
<<<<<<< HEAD
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Range"], // Allow custom headers like "Range"
    exposedHeaders: ["Content-Range", "Accept-Ranges", "Content-Length"], // Allow browser to access these headers
  })
);
=======
app.use(cors({
  origin:"*"
}));

>>>>>>> 0229316fcd338dd7f38145630078c69f3cbef296
app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use("/api/download", downloadRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
