import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URI);
    console.log("database connected successfully !", connection?.connections[0]?.host);
    console.log("Print connection string of database !");
  } catch (error) {
    console.log("Database connection failed !", error);
    throw new Error("Database connection failed !");
  }
};

export { connectDB };
