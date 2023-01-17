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
import { workerEvent } from './backgroundJobs/workers';
import { workers } from './constants';
import { UploadResponse } from './interfaces/service/image/uploadResponse';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

_init(app);

socket.on('connection', (obj) => {
  workerEvent.on(workers.EMIT_DATA, (meta: UploadResponse) => {
    console.log(`🚀 ~ file: index.ts:26 ~ workerEvent.on ~ meta`, meta.data.publicId, meta.image.processType);
    socket.emit(meta.data.publicId, meta);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// TODO: implement pino logger
