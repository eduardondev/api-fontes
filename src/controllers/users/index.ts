import { Request, Response } from "express";
import { responseAPI } from "../../utils/ResponseAPI";

export function createUser(req: Request, res: Response) {
  console.log("ola edu");

  return res.json(responseAPI(false, "Tudo certo"));
}

export function deleteUser() {
  console.log(2);
}
