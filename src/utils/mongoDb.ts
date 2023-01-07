import mongoose from 'mongoose';

import { MongooseConnection } from '../interfaces/utils/mongoConnection';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: process.env.NODE_ENV === 'production' ? 3000000 : 30000,
};

export const connectToDB = ({ name, uri }): MongooseConnection => {
  const db = mongoose.createConnection(uri, options);

  db.once('open', () => {
    console.log(`${name} Database connected successfully`);
  });

  db.on('error', function (error) {
    console.error(`Error in ${name} MongoDb connection: ${error}`);
    db.close();
  });

  db.on('close', function () {
    console.log(`Closing ${name} Database...`);
  });

  return db;
};
