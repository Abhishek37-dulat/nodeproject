import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import constants from "./constants.json";
import userRouter from "./routers/userRouter";
import commentRouter from "./routers/commentRouter";
// import postideaRouter from "./routers/postideaRouter";
// import "./db/conn";

config();
const app = express();

const PORT = process.env.PORT;
const DB = process.env.DB;

app.use(express.json());



mongoose.connect(DB, {
  useNewUrlParser: true
}).then(() => {
  console.log("connection successful!");
}).catch(err => {
  console.log(err);
})
  
  
app.use("/user", userRouter);
// app.use("/comment", commentRouter);
// app.use("/idea", postideaRouter);


app.listen(PORT, () => {
  //eslint-disable-next-line no-console
  console.log(`http://localhost:${PORT} `);
});
