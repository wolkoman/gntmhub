import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function useJwt(options: { dontRedirectTo?: string }) {
  const router = useRouter();
  const [jwt, setJwt] = useState(null);
  useEffect(() => {
    const rawJwt = localStorage.getItem("JWT");
    if (rawJwt) {
      const jwt = JSON.parse(atob(rawJwt.split(".")[1]));
      setJwt(jwt);
      if (!jwt.active && options.dontRedirectTo !== "/verify-phone") {
        router.push("/verify-phone");
      }
    } else if (options.dontRedirectTo !== "/login") {
      router.push("/login");
    }
  }, [router]);
  return jwt;
}

export function setJwt(jwt) {
  const rawJwt = localStorage.setItem("JWT", jwt);
}
