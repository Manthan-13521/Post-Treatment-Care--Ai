import "server-only";
import mongoose from "mongoose";
const uri = process.env.MONGODB_URI;
declare global { var mongooseConnection: Promise<typeof mongoose> | undefined; }
export async function connectDb() {
  if (!uri) throw new Error("MONGODB_URI is required for database-backed access.");
  global.mongooseConnection ??= mongoose.connect(uri, { bufferCommands: false });
  return global.mongooseConnection;
}
