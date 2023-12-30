import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDb } from "./config/dbConn.js";

dotenv.config();

connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error: " + error);
      throw Error;
    });
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server listening at ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed !!! ", err);
  });
