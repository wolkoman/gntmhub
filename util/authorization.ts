import { IncomingMessage, ServerResponse } from "http";
import { parse, serialize } from "cookie";
import { sign, verify } from "jsonwebtoken";
import {getCollection, ObjectId, UserEntity} from "./mongo";

export function setAuthorizationCookie(res: ServerResponse, id: string) {
  const jwt = sign({ id }, process.env.JWT_SECRET);
  res.setHeader(
    "Set-Cookie",
    serialize("jwt", jwt, {
      path: "/",
      expires: new Date(2022, 1, 1),
    })
  );
}

export async function getUserFromRequest(
  req: IncomingMessage,
  requireUserToBeActive = true
): Promise<UserEntity | null> {
  if (!req.headers.cookie) return undefined;
  const cookie = parse(req.headers.cookie);
  if (!cookie.jwt) return undefined;
  const rawJwt = cookie.jwt;
  const jwt = verify(rawJwt, process.env.JWT_SECRET) as {
    id?: string;
  };
  if (jwt.id) {
    const userCollection = await getCollection(UserEntity);
    const user = await userCollection.findOne({ _id: ObjectId(jwt.id) });
    userCollection.close();
    return requireUserToBeActive && !user.active ? null : user;
  } else {
    return undefined;
  }
}