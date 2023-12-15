import express from "express";
import { Model } from "mongoose";

export const getGoodsRoutes = (
  db: Model<{
    title?: string;
    userId?: string;
    category?: string;
    description?: string;
    price?: string;
  }>
) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const goods = await db.find({});
      return res.status(200).json(
        goods.map((g) => ({
          id: g._id,
          title: g.title,
          userId: g.userId,
          category: g.category,
          description: g.description,
          price: g.price,
        }))
      );
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "goods not found" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const { title, userId, category, description, price } = req.body;

      const product = new db({
        title,
        userId,
        category,
        description,
        price,
      });

      await product.save();

      return res.status(200).json({ message: "product create" });
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "goods not found" });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const product = await db.findById(req.params.id);
      return res.status(200).json({
        id: product?._id,
        title: product?.title,
        userId: product?.userId,
        category: product?.category,
        description: product?.description,
        price: product?.price,
      });
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "product not found" });
    }
  });

  router.get("/user/:userId", async (req, res) => {
    try {
      const goods = await db.find({ userId: req.params.userId });
      return res.status(200).json(
        goods.map((g) => ({
          id: g._id,
          title: g.title,
          userId: g.userId,
          category: g.category,
          description: g.description,
          price: g.price,
        }))
      );
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "user not found" });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await db.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "product delete" });
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "product not found" });
    }
  });

  router.delete("/user/:userId", async (req, res) => {
    try {
      await db.deleteMany({ userId: req.params.userId });
      return res.status(200).json({ message: "goods delete" });
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "goods not found" });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      await db.findByIdAndUpdate(req.params.id, req.body);

      return res.status(200).json({ message: "product update" });
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "product not found" });
    }
  });

  return router;
};
