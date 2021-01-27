import React, { useEffect, useState } from "react";
import { Site } from "../components/Site";

export default function Home() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [state, setState] = useState<"ACTIVE" | "FETCHING" | "ERROR">("ACTIVE");
  const login = () => {
    if (state !== "ACTIVE") return;
    setState("FETCHING");
    fetch("/api/user/auth", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    })
      .then(response =>
        response.status === 200 ? response.json() : Promise.reject()
      )
      .then(user => console.log(user))
      .catch(err => {
        console.log(err);
        setState("ERROR");
      });
  };
  useEffect(() => setState("ACTIVE"), [form]);

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
