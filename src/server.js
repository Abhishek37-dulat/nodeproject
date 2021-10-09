import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import constants from "./constants.json";
import userRouter from "./routers/userRouter";
// import postideaRouter from "./routers/postideaRouter";
// import "./db/conn";

import {Router} from "express";

const router =  Router();

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

app.use("/", router.get('/', (req, res) => {
  console.log("Hello Server!!!");
  res.send("Hello Server!!!");
}));

  
app.use("/user", userRouter);
// app.use("/comment", commentRouter);
// app.use("/idea", postideaRouter);


app.listen(PORT, () => {
  //eslint-disable-next-line no-console
  console.log(`http://localhost:${PORT} `);
});
