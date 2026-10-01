import mongoose from "mongoose";

// Reuse one connection across hot reloads and concurrent requests
const globalForMongoose = globalThis as unknown as {
  mongooseConnection?: Promise<typeof mongoose>;
};

/**
 * Connects Mongoose once and returns the shared connection.
 * Call this in server code before querying Mongoose models.
 */
export async function connectDB(): Promise<typeof mongoose> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  globalForMongoose.mongooseConnection ??= mongoose
    .connect(mongoUri)
    .catch((error: unknown) => {
      // Let the next call retry instead of caching the failure
      globalForMongoose.mongooseConnection = undefined;
      throw error;
    });

  return globalForMongoose.mongooseConnection;
}

/**
 * Gracefully close the MongoDB connection
 */
export async function disconnectDB(): Promise<void> {
  await mongoose.connection.close();
  globalForMongoose.mongooseConnection = undefined;
}
