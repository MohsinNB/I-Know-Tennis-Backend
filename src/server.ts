import { Server } from "http";
import mongoose from "mongoose";
import { DB_URL, PORT } from "./app/config/env";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to database");
    server = app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to connect server", error);
  }
};

startServer();
