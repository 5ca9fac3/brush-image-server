import { config } from 'dotenv';
config();

import express from 'express';
import http from 'http';
import socketIo from 'socket.io';

const app = express();
const server = http.createServer(app);
export const socket = new socketIo.Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
});

import { _init } from './controller';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

_init(app);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// TODO: implement pino logger
