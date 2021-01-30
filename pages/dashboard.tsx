import React from "react";
import { Site } from "../components/Site";
import { useJwt } from "../util/jwt";
import { Navigation } from "../components/Navigation";

export default function Home() {
  const jwt = useJwt({ dontRedirectTo: "/dashboard" });
  return (
    <Site>
      <Navigation />
      <main className="flex justify-center items-center mt-12">
        <div className="w-full max-w-2xl px-4">
          <div className="font-serif text-4xl">
            Hallo <span className="text-brand">{jwt?.name}!</span>
          </div>
        </div>
      </main>
    </Site>
  );
}
