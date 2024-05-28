import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import coordinator from "./Routes/coordinator";
import { initSockets } from "./socket";
import { CustomError } from "./Errors/CustomError";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(coordinator);

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
  },
});

initSockets(io);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof CustomError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Something went wrong" });
  }
);

const PORT = process.env.PORT || 3000; // Use the same port for HTTP and WebSocket
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
