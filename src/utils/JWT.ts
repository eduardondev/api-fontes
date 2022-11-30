import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY as string;

export function generateJWT(data: string | object, expires_in?: string) {
  const tenDaysInSeconds = 864000;
  if (!data) return "";
  return jwt.sign({ data }, secretKey, {
    expiresIn: expires_in || tenDaysInSeconds,
  });
}

export function decodeJWT(token: string) {
  if (!token) return null;
  return jwt.decode(token);
}

export function verifyJWT(token: string) {
  try {
    if (!token) return null;

    return jwt.verify(token, secretKey);
  } catch (err) {
    return false;
  }
}
