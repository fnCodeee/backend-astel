import express from "express";
import { PORT } from "./src/utils/env.js";
import connectDB from "./src/utils/database.js";
import cors from "cors";
import router from "./src/router/api.js";
import mongoose from "mongoose";

const app = express();
const port = PORT;

async function init() {
  await connectDB();
  if (mongoose.connection.readyState === 1) {
    console.log("Database connected");
  } else {
    console.log("Database not connected");
  }
  app.use(
    cors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    }),
  );
  app.use(express.json());
  app.use("/api", router);
  app.get("/", (req, res) => {
    res.json("Server Berhasil dijalankan!");
  });
  app.listen(port, () => {
    console.log(`Running at port ${port}`);
  });
}

init();
