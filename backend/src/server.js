import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDb } from "./config/dbConn.js";

dotenv.config();

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server listening at  port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed !!! ", error);
  });

app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || "Something went wrong";

  return res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: err.stack,
  });
});
