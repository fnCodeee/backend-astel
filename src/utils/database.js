import mongoose from "mongoose";
import { URI } from "./env.js";

if (!URI) {
  throw new Error("DATABASE TIDAK DI TEMUKAN DI ENV!");
}

let cache = global.mongoose;

if (!cache) {
  cache = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(URI, {
      dbName: "db-astel",
    });
  }

  cache.conn = await cache.promise;

  return cache.conn;
};

export default connectDB;
  