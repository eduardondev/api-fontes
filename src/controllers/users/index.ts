import { Request, Response } from "express";
import { User } from "./types";
import { responseAPI } from "../../utils/ResponseAPI";
import { prisma } from "../../data/index";
import { encrypt } from "../../utils/Bcrypt";

export async function createUser(req: Request, res: Response) {
  try {
    let { name, username, password }: User = req.body;

    if (!name || !username || !password) {
      res.status(400);
      return res.json(responseAPI(true, "Required data not sent."));
    }

    const verifyAlreadyExists = await prisma.users.findFirst({
      where: {
        username,
      },
    });

    if (verifyAlreadyExists) {
      res.status(400);
      return res.json(responseAPI(true, "Username already exists.", username));
    }

    password = encrypt(password);

    const { password: userPassword, ...user } = await prisma.users.create({
      data: {
        name,
        username,
        password,
      },
    });

    return res.json(responseAPI(false, "User has been created.", user));
  } catch (err) {}
}

export async function getAll(req: Request, res: Response) {
  try {
    const getAllUsers = await prisma.users.findMany();

    const users = getAllUsers.map((item) => {
      item.password = "";
      return item;
    });

    res.status(200);
    return res.json(responseAPI(false, "Users found.", users));
  } catch (err) {
    console.log(err);
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const verifyUserExists = await prisma.users.findFirst({
      where: {
        id,
      },
    });

    if (!verifyUserExists) {
      res.status(404);
      return res.json(responseAPI(true, "User not found.", id));
    }

    const deleteUser = await prisma.users.delete({
      where: {
        id,
      },
    });

    res.status(200);
    return res.json(responseAPI(false, "User has been deleted.", deleteUser));
  } catch (err) {
    console.log(err);
  }
}
