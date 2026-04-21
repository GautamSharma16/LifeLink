import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.CLUSTER;
    if (!mongoUri) {
      throw new Error("Missing Mongo URI. Set MONGO_URI (or legacy CLUSTER) in backend/.env");
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
