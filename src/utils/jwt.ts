import jwt from "jsonwebtoken";

const JWTKEY = process.env.JWTKEY;

export const encode = (payload: object) => {
  return jwt.sign(payload, JWTKEY as string);
};
export const decode = (payload: string) => {
  return jwt.verify(payload, JWTKEY as string);
};
