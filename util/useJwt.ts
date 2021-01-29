import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default (options: { redirectOnEmpty?: boolean }) => {
  const router = useRouter();
  const [jwt, setJwt] = useState(null);
  useEffect(() => {
    const jwt = localStorage.getItem("JWT");
    if (jwt) {
      setJwt(JSON.parse(atob(jwt.split(".")[1])));
    } else if (options.redirectOnEmpty) {
      router.push("/");
    }
  }, [router]);
  return jwt;
};
