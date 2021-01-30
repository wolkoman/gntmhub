import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Route } from "./routes";

export function useJwt(options: { dontRedirectTo?: string }) {
  const router = useRouter();
  const [jwt, setJwt] = useState(null);
  useEffect(() => {
    const rawJwt = localStorage.getItem("JWT");
    if (rawJwt) {
      const jwt = JSON.parse(atob(rawJwt.split(".")[1]));
      setJwt(jwt);
      if (!jwt.active && options.dontRedirectTo !== Route.VERIFY) {
        router.replace(Route.VERIFY);
      }
    } else if (options.dontRedirectTo !== Route.LOGIN) {
      router.replace(Route.LOGIN);
    }
  }, [router]);
  return jwt;
}

export function setJwt(jwt) {
  const rawJwt = localStorage.setItem("JWT", jwt);
}
