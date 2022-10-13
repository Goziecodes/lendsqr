import { NextFunction, Request, Response } from "express";
import { IExpressRequest, IExpressResponse } from "../interfaces";

import { UserModel } from "../models/user.model";
import { decode } from "../utils/jwt";

export default async (
  req: IExpressRequest | Request,
  res: IExpressResponse | Response,
  next: NextFunction
) => {
  const header = req.get("Authorization");
  const errorMessage = "Please provide a valid access token";

  if (!header) {
    return (res.status(401) as IExpressResponse).error(errorMessage);
  }


  if (!header.startsWith("Bearer ")) {
    return (res.status(401) as IExpressResponse).error(errorMessage);
  }

  const token = header.slice(7);

  try {
    const decodeToken = decode(token) as Record<string, string | number>;
    const foundUser = await UserModel.query()
    .findOne({ email: decodeToken.email });

    if (!foundUser) {
      return (res.status(403) as IExpressResponse).error(errorMessage);
    }

    (req as IExpressRequest).user = foundUser;
  } catch (error) {
    return (res.status(403) as IExpressResponse).error("invalid Token provided");
  }

  next();
};
