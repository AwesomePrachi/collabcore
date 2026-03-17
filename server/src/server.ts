import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { createApp } from "./app.js";
import { registerDocumentSocket } from "./socket/document.socket.js";

const app = createApp();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

registerDocumentSocket(io);

const PORT = process.env.PORT || 5000;
// console.log("GROQ KEY:", process.env.GROQ_API_KEY)

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ MongoDB Connected");

    httpServer.listen(PORT, () => {
      console.log(`🚀 CollabCore Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup failed:", error);
    process.exit(1);
  }
}

start();