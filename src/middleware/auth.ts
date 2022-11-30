import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/JWT";
import { responseAPI } from "../utils/ResponseAPI";

export async function isAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header("x-access-token");

    if (!token) {
      res.status(401);
      return res.json(responseAPI(true, "Auth token is missing!"));
    }

    const verifyToken = verifyJWT(token);

    if (!verifyToken) {
      res.status(401);
      return res.json(responseAPI(true, "Auth token is invalid!"));
    }

    return next();
  } catch (err) {
    console.log(err);
  }
}
