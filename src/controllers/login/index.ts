import { Request, Response } from "express";
import { Login } from "./types";
import { User } from "../users/types";
import { responseAPI } from "../../utils/ResponseAPI";
import { prisma } from "../../data/index";
import { decrypt } from "../../utils/Bcrypt";
import { generateJWT } from "../../utils/JWT";

export async function login(req: Request, res: Response) {
  try {
    const { username, password }: Login = req.body;

    if (!username || !password) {
      res.status(400);
      return res.json(responseAPI(true, "Required data not sent."));
    }

    const user = await prisma.users.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      res.status(404);
      return res.json(responseAPI(true, "User not found.", username));
    }

    const verifyPassword = decrypt(password, user?.password);

    if (!verifyPassword) {
      res.status(400);
      return res.json(
        responseAPI(true, "Username or password incorrect.", username)
      );
    }

    user.password = "";

    const JWT = generateJWT(user);

    res.status(200);
    return res.json(responseAPI(false, "User logged.", JWT));
  } catch (err) {
    console.log(err);
  }
}
