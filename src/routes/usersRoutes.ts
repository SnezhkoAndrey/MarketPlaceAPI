import express from "express";
import { Model } from "mongoose";

export const getUsersRoutes = (
  db: Model<{
    name?: string | undefined;
    email?: string | undefined;
  }>
) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const users = await db.find({});
      res.json(users.map((u) => ({ id: u._id, name: u.name, email: u.email })));
    } catch (e) {
      console.log(e);
      res.sendStatus(404);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const user = await db.findById(req.params.id);
      res.json(user);
    } catch (e) {
      console.log(e);
      res.sendStatus(404);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await db.findByIdAndDelete(req.params.id);
      res.sendStatus(204);
    } catch (e) {
      console.log(e);
      res.sendStatus(404);
    }
  });

  router.post("/", async (req, res) => {
    if (!req.body.name || !req.body.email) {
      res.sendStatus(400);
      return;
    }

    try {
      const user = new db({
        name: req.body.name,
        email: req.body.email,
      });

      await user.save();

      res.sendStatus(201);
    } catch (e) {
      console.log(e);
      res.sendStatus(400);
    }
  });

  router.put("/:id", async (req, res) => {
    if (!req.body.name || !req.body.email) {
      res.sendStatus(400);
      return;
    }

    try {
      await db.findByIdAndUpdate(req.params.id, req.body);
      res.sendStatus(204);
    } catch (e) {
      console.log(e);
      res.sendStatus(404);
    }
  });

  return router;
};
