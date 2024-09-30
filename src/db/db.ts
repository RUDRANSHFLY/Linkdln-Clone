import mongoose from "mongoose";

const connectionString = `${process.env.MONGO_DB_URL}`;

if (!connectionString) {
  throw new Error("Please provide a valid connection string");
}

export const connectDB = async () => {
  if (mongoose.connection?.readyState >= 1) {
    console.log("---Already connected to MongoDB---");
    return;
  }

  try {
    console.log("---Connecting to MongoDB---");
    await mongoose.connect(connectionString);
  } catch (error) {
    console.log("---Error connected to MongoDB---", error);
  }
};
