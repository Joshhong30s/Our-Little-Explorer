import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Cast global to include our mongoose cache
const globalWithMongoose = global as typeof global & {
  mongoose?: MongooseCache;
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Ensure global.mongoose is initialized
  const cache = globalWithMongoose.mongoose ?? { conn: null, promise: null };
  globalWithMongoose.mongoose = cache;

  if (cache.conn) {
    console.log("using existing mongoose connection");
    return cache.conn;
  }

  if (!cache.promise) {
    console.log("creating new mongoose connection");
    cache.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cache.conn = await cache.promise;
  return cache.conn;
}

export default dbConnect;
