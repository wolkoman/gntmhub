import React, { useEffect, useState } from "react";
import { Site } from "../components/Site";
import { useRouter } from "next/router";
import useJwt from "../util/useJwt";

export default function Home() {
  const jwt = useJwt({ redirectOnEmpty: true });
  return (
    <Site>
      <div className="p-4 border border-black">
        <div className="text-4xl font-serif">
          GNTM<span className="text-brand">HUB</span>
        </div>
      </div>
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
