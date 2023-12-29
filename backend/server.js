import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config();

app.listen(process.env.PORT || 4000, () => {
  app.on("error", (error) => {
    console.log("Error: " + error);
    throw Error;
  });
  console.log(`Serving listening at ${process.env.PORT}`);
});
