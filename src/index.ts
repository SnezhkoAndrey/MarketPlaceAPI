import express from "express";
import mongoose from "mongoose";
import { Users } from "../models/usersModel";
import { Goods } from "../models/goodsModel";
import { getUsersRoutes } from "./routes/usersRoutes";
import dotenv from "dotenv";
import { authRoutes } from "./routes/authRoutes";
import { cors } from "./middleware/corsMidleware";
import { getGoodsRoutes } from "./routes/goodsRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const jsonBodyMiddleware = express.json();

app.use(cors);
app.use(jsonBodyMiddleware);
app.use("/users", getUsersRoutes(Users));
app.use("/goods", getGoodsRoutes(Goods));
app.use("/", authRoutes(Users));

app.get("/", (req, res) => {
  res.send("hello");
});

async function start() {
  try {
    await mongoose.connect(process.env.MONGOPORT as string);

    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
