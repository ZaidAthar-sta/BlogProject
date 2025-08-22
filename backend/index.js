import dotenv from "dotenv";
dotenv.config();
import express from "express";
import DBConfig from "./config/DBConnect.js";
import cors from "cors";
import userRoute from "./routes/userRoutes.js";
import postRoute from "./routes/postRoute.js";
import commentRoute from "./routes/commentRoutes.js"
import connectCloudinary from "./config/cloudinary.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

DBConfig();
connectCloudinary();

app.get("/", (req, res) => {
  res.send("Welcome to localhost 5000 !!!");
});

app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/comments", commentRoute);

const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
