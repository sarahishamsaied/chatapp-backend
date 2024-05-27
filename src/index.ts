// index.ts

import express from "express";

import coordinator from "./Routes/coordinator";
import dotenv from "dotenv";
import { CustomError } from "./Errors/CustomError";
import { Server as SocketServer } from "socket.io";
import http from "http";
import { initSockets } from "./socket";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());
app.use(coordinator);
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
  },
});
console.log("Socket server started", io._checkNamespace);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log("here errro");
    if (err instanceof CustomError) {
      console.log("here");
      console.log(err);
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
);

initSockets(io);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` server is running on port ${PORT}`);
});

server.listen(3001, () => {
  console.log("socket server started on port 3001");
});
