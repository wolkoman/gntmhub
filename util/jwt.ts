import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function useJwt(options: { redirectOnEmpty?: boolean }) {
  const router = useRouter();
  const [jwt, setJwt] = useState(null);
  useEffect(() => {
    const rawJwt = localStorage.getItem("JWT");
    if (rawJwt) {
      const jwt = JSON.parse(atob(rawJwt.split(".")[1]));
      setJwt(jwt);
      if (!jwt.active && options.redirectOnEmpty) {
        router.push("/verify-phone");
      }
    } else if (options.redirectOnEmpty) {
      router.push("/");
    }
  }, [router]);
  return jwt;
}

export function setJwt(jwt) {
  const rawJwt = localStorage.setItem("JWT", jwt);
}
