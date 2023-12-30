import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DATABSE_URI}/${DB_NAME}`
    );
    console.log(
      `Connected to MongoDb at host : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection error: " + error);
    process.exit(1);
  }
};

export { connectDb };
