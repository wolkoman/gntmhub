import React, { useEffect, useState } from "react";
import { Site } from "../components/Site";
import fetchJson from "../util/fetchJson";
import { useRouter } from "next/router";
import { setJwt, useJwt } from "../util/jwt";

export default function Home() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [state, setState] = useState<"ACTIVE" | "FETCHING" | "ERROR">("ACTIVE");
  const jwt = useJwt({});
  const router = useRouter();
  const login = () => {
    if (state !== "ACTIVE") return;
    setState("FETCHING");
    fetchJson("/api/user/auth", form)
      .then(resp => {
        setJwt(resp.jwt);
        router.push("/dashboard");
      })
      .catch(err => {
        setForm({ username: "", password: "" });
        setState("ERROR");
      });
  };
  useEffect(() => setState("ACTIVE"), [form]);
  useEffect(() => {
    if (jwt) {
      router.replace("/dashboard");
    }
  });

  return (
    <Site>
      <main className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center w-52 pb-24">
          <div className="text-7xl font-serif">
            GNTM<span className="text-brand">HUB</span>
          </div>
          <input
            name="username"
            type="text"
            disabled={state === "FETCHING"}
            className="text-black p-2 my-1 w-full rounded"
            placeholder="Benutzername"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
          />
          <input
            name="password"
            type="password"
            disabled={state === "FETCHING"}
            className="text-black p-2 my-1 w-full rounded"
            placeholder="Passwort"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            onKeyDown={e => (e.key === "Enter" ? login() : null)}
          />
          <div
            className="bg-brand text-black p-2 my-1 w-full rounded font-bold hover:opacity-80 cursor-pointer overflow-hidden text-center"
            style={{
              opacity: state !== "ACTIVE" ? 0.5 : null,
              cursor: state !== "ACTIVE" ? "auto" : null,
            }}
            onClick={login}
          >
            Login
          </div>
          {state === "ERROR" ? (
            <div className="border-danger text-danger border-solid border p-2 my-1 w-full rounded text-sm">
              Die Zugangsdaten sind inkorrekt.
            </div>
          ) : null}
        </div>
      </main>
    </Site>
  );
}
