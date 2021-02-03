import {ServerResponse} from "http";
import {serialize} from "cookie";

export function setAuthorizationCookie(res: ServerResponse, jwt: string) {
    res.setHeader("Set-Cookie", serialize("jwt", JSON.stringify(jwt), {path: "/", expires: new Date(2022, 1, 1)}));
}