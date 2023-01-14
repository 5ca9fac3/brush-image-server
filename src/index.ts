import { config } from 'dotenv';
config();

import express from 'express';
const app = express();

import { _init } from './controller';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

_init(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// TODO: implement pino logger
