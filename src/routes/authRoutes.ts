import express, { Request } from "express";
import { Model } from "mongoose";
import { default as bcrypt } from "bcryptjs";
import { JwtPayload, default as jwt } from "jsonwebtoken";
import { authMW } from "../middleware/authMiddleware";

export const authRoutes = (
  db: Model<{
    name?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
  }>
) => {
  const router = express.Router();

  router.get("/registration", (req, res) => {
    res.send("auth");
  });

  router.post("/registration", async (req, res) => {
    if (!req.body.name || !req.body.email) {
      res.status(400).json({ message: "bad request" });
      return;
    }

    try {
      const { email, password, name } = req.body;

      const candidate = await db.findOne({ email });

      if (candidate) {
        return res.status(400).json({ message: "this email already exists" });
      }

      const hashPassword = await bcrypt.hash(password, 8);

      const user = new db({
        name: name,
        email: email,
        password: hashPassword,
      });

      await user.save();

      return res.status(200).json({ email, password });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "some error" });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await db.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }

      const isPasswordValid = bcrypt.compareSync(
        password,
        user.password as string
      );

      if (!isPasswordValid) {
        return res.status(400).json({ message: "password is uncorrect" });
      }

      const token = jwt.sign({ id: user.id }, process.env.SECRETKEY as string, {
        expiresIn: "1h",
      });

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "some error" });
    }
  });

  interface CustomRequest extends Request {
    user?: JwtPayload;
  }

  router.get("/auth", authMW, async (req: CustomRequest, res) => {
    try {
      const user = await db.findById(req.user?.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const token = jwt.sign(
        { id: user._id },
        process.env.SECRETKEY as string,
        {
          expiresIn: "1h",
        }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "some error" });
    }
  });

  return router;
};
