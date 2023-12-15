import { NextFunction, Response, Request } from "express";
import { JwtPayload, default as jwt } from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: JwtPayload;
}

export const authMW = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token: string | undefined = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Authentication error" });
    }

    const splitToken = token.split(" ")[1];
    if (!splitToken) {
      return res.status(401).json({ message: "Authentication error" });
    }

    const decoded = jwt.verify(splitToken, process.env.SECRETKEY as string);

    req.user = decoded as JwtPayload;

    next();
  } catch (e) {
    return res.status(401).json({ message: "auth error" });
  }
};
