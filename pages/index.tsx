import React from "react";
import { Site } from "../components/Site";

export default function Home() {
  return (
    <Site>
      <main className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="bg-gray-darkest rounded-xl p-6">
            <div className="text-8xl font-serif">
              GNTM<span className="text-brand">HUB</span>
            </div>
            <div className="font-sans w-64 py-2 pb-6 text-justify">
              Nutzen Sie Ihr detailliertes Wissen über Laufstege und
              Fotoshootings, damit Sie sich unter Ihren Freunden als der wahre
              GNTM-Kenner beweisen können.
            </div>
            <div className="flex flex-row">
              <input
                type="text"
                className="text-black p-2 mr-2 w-48 rounded"
                placeholder="Benutzername"
              />
              <div className="bg-brand text-black p-2 rounded font-bold hover:opacity-80 cursor-pointer overflow-hidden">
                Login
              </div>
            </div>
          </div>
        </div>
      </main>
    </Site>
  );
}
