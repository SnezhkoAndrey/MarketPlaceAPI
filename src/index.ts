import express from "express";
import mongoose from "mongoose";
import { Users } from "../models/usersModel";
import { getUsersRoutes } from "./routes/usersRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

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

app.use("/users", getUsersRoutes(Users));

// app.get("/users", async (req, res) => {
//   const users = await Users.find({});

//   console.log(users);

//   res.send(
//     users.length
//       ? users.map((u) => ({ id: u._id, name: u.name, email: u.email }))
//       : "noUsers"
//   );
// });

// app.get("/users/:id", async (req, res) => {
//   const user = await Users.findById(req.params.id);

//   console.log(user);

//   res.send(user);
// });

// app.delete("/users/:id", async (req, res) => {
//   await Users.findByIdAndDelete(req.params.id);

//   res.send("deleteUser");
// });

// app.post("/users", async (req, res) => {
//   const user = new Users({
//     name: req.body.name,
//     email: req.body.email,
//   });

//   await user.save();

//   res.send("create user!");
// });

// app.put("/users/:id", async (req, res) => {
//   await Users.findByIdAndUpdate(req.params.id, req.body);

//   res.send("create user!");
// });

start();
