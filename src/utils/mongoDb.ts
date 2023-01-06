import mongoose from 'mongoose';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: process.env.NODE_ENV === 'production' ? 3000000 : 30000,
};

export const mongoDb = mongoose.createConnection(process.env.MONGODB_URI, options, (err) => {
  if (!err) {
    console.log('Connected to MongoDB...');
  }
});
