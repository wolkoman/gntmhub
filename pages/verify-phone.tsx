import React, { useEffect, useState } from "react";
import { Site } from "../components/Site";
import fetchJson from "../util/fetchJson";
import { useRouter } from "next/router";
import { setJwt, useJwt } from "../util/jwt";

export default function Home() {
  const [form, setForm] = useState({ token: "" });
  const jwt = useJwt({ redirectOnEmpty: false });
  const [state, setState] = useState<{
    state: "ACTIVE" | "FETCHING" | "ERROR";
    msg?: "true";
  }>({ state: "ACTIVE" });
  const router = useRouter();
  const verify = () => {
    if (state.state !== "ACTIVE") return;
    setState({ state: "FETCHING" });
    fetchJson("/api/user/verify-phone", { ...form, username: jwt.name })
      .then(resp => {
        console.log(resp);
        return resp;
      })
      .then(resp =>
        resp.err ? Promise.reject(resp.msg) : Promise.resolve(resp.msg)
      )
      .then(resp => {
        console.log("SUC", resp);
        setJwt(resp);
        router.push("/dashboard");
      })
      .catch(err => {
        console.log("ERROR");
        setForm({ token: "" });
        setTimeout(() => setState({ state: "ERROR", msg: err }), 10);
      });
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
            name="code"
            type="number"
            disabled={state.state === "FETCHING"}
            className="text-black p-2 my-1 w-full rounded"
            placeholder="SMS Token"
            value={form.token}
            onChange={e => setForm(f => ({ ...f, token: e.target.value }))}
          />
          <div
            className="bg-brand text-black p-2 my-1 w-full rounded font-bold hover:opacity-80 cursor-pointer overflow-hidden text-center"
            style={{
              opacity: state.state !== "ACTIVE" ? 0.5 : null,
              cursor: state.state !== "ACTIVE" ? "auto" : null,
            }}
            onClick={verify}
          >
            Bestätigen
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
