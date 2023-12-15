import { Schema, model } from "mongoose";

const GoodsSchema = new Schema({
  title: { type: String, require: true },
  userId: { type: String, require: true },
  category: { type: String, require: true },
  description: { type: String, require: false },
  price: { type: String, require: true },
});

export const Goods = model("Goods", GoodsSchema);
