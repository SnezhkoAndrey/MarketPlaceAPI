import express from "express";
import { Model } from "mongoose";

export const getUsersRoutes = (
  db: Model<{
    name?: string;
    email?: string;
    password?: string;
  }>
) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const users = await db.find({});
      return res.status(200).json(
        users.map((u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          password: u.password,
        }))
      );
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "users not found" });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const user = await db.findById(req.params.id);
      return res.status(200).json({
        id: user?._id,
        email: user?.email,
        password: user?.password,
        name: user?.name,
      });
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "user not found" });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await db.findByIdAndDelete(req.params.id);

      return res.status(200).json({ message: "user delete" });
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "user not found" });
    }
  });

  router.put("/:id", async (req, res) => {
    if (!req.body.name) {
      res.status(400).json({ message: "bad request" });
      return;
    }

    try {
      await db.findByIdAndUpdate(req.params.id, req.body);

      return res.status(200).json({ message: "user update" });
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "user not found" });
    }
  });

  return router;
};
