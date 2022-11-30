import bcrypt from "bcrypt";
import { Logger } from "./Logger";

export const encrypt = (string: string) => {
  if (!string) return "";

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(string, salt);

  return hash;
};

export const decrypt = (pass: string, hash: string) => {
  if (!pass) return "";

  let decrypt = bcrypt.compareSync(pass, hash);

  return decrypt;
};
