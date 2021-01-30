import { Router, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Site } from "../components/Site";
import { fetchJson } from "../util/fetchJson";
import { setJwt } from "../util/jwt";

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordRetype: "",
    phone: "",
  });
  const [state, setState] = useState<{
    state: "ACTIVE" | "FETCHING" | "ERROR";
    msg?: string;
  }>({ state: "ACTIVE" });
  const signup = () => {
    if (state.state !== "ACTIVE") return;
    setState({ state: "FETCHING" });
    fetchJson("/api/user/signup", form)
      .then(({ err, msg }) =>
        err ? Promise.reject(msg) : Promise.resolve(msg)
      )
      .then(msg => {
        setJwt(msg);
        router.push("/dashboard");
      })
      .catch(err => setState({ state: "ERROR", msg: err }));
  };
  useEffect(() => setState({ state: "ACTIVE" }), [form]);

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
            disabled={state.state === "FETCHING"}
            className="text-black p-2 my-1 w-full rounded"
            placeholder="Benutzername"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
          />
          <input
            name="password"
            type="password"
            disabled={state.state === "FETCHING"}
            className="text-black p-2 my-1 w-full rounded"
            placeholder="Passwort"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />
          <input
            name="password-retype"
            type="password"
            disabled={state.state === "FETCHING"}
            className="text-black p-2 my-1 w-full rounded"
            placeholder="Passwort wiederholen"
            value={form.passwordRetype}
            onChange={e =>
              setForm(f => ({ ...f, passwordRetype: e.target.value }))
            }
            onKeyDown={e => (e.key === "Enter" ? signup() : null)}
          />
          <input
            name="phone"
            type="tel"
            disabled={state.state === "FETCHING"}
            className="text-black p-2 my-1 w-full rounded"
            placeholder="Telefonnummer"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            onKeyDown={e => (e.key === "Enter" ? signup() : null)}
          />
          <div
            className="bg-brand text-black p-2 my-1 w-full rounded font-bold hover:opacity-80 cursor-pointer overflow-hidden text-center"
            style={{
              opacity: state.state !== "ACTIVE" ? 0.5 : null,
              cursor: state.state !== "ACTIVE" ? "auto" : null,
            }}
            onClick={signup}
          >
            Registrieren
          </div>
          {state.state === "ERROR" ? (
            <div className="border-danger text-danger border-solid border p-2 my-1 w-full rounded text-sm">
              {state.msg}
            </div>
          ) : null}
        </div>
      </main>
    </Site>
  );
}
