import { config } from 'dotenv';
config();

import express from 'express';
const app = express();

import { router } from './controller/router';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
