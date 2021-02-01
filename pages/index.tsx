import React from "react";
import { Site } from "../components/Site";
import Link from "next/link";
import { Route } from "../util/routes";
import { Title } from "../components/Title";
import { GPoints } from "../components/GPoints";

export default function Home() {
  return (
    <Site>
      <div className="flex">
        <div className="w-full max-w-2xl px-4 mt-16">
          <div className="text-5xl md:text-8xl font-bold">GNTMHUB</div>
          <div className="font-serif text-2xl py-2">
            Die zentrale Plattform zu den Erfolgschancen der Germanys Next
            Topmodel Kandidatinnen.
          </div>
          <div className="flex my-8">
            <Link href={Route.LOGIN}>
              <div className="px-4 py-2 text-lg border border-pohutukawa-400 text-pohutukawa-400 font-bold rounded mr-4 cursor-pointer">
                Login
              </div>
            </Link>
            <Link href={Route.SIGNUP}>
              <div className="px-4 py-2 text-lg text-white font-bold bg-pohutukawa-400 rounded cursor-pointer">
                Registrieren
              </div>
            </Link>
          </div>
        </div>
        <img src="/model.svg" className="mt-20 w-20 md:w-40" />
      </div>
      <div>
        <Title>Wie funktioniert es?</Title>
        <div>
          Beim Erstellen eines Kontos bekommen Sie automatisch 1000 <GPoints />.
          Diese gpoints können Sie auf die Kandidatinnen in Form von Aktien
          setzen. Kaufen viele Spieler die Aktie, steigt deren Wert, verkaufen
          viele Spieler die Aktie, sinkt deren Wert. Kaufen und verkaufen Sie
          Aktien von Models zum rechtzeitigen Zeitpunkt und bemerken Sie Trends
          um Ihre Anzahl an gpoints zu maximieren. Die Spielerin oder der
          Spieler mit den meisten gpoints am Ende der Staffel gewinnt.
        </div>
      </div>
      <div>
        <Title>Wie habe ich dabei am meisten Spaß?</Title>
        <div>
          Lade Sie Ihre Freunde ein und vergleichen Sie Ihre <GPoints /> Werte
          auf der globalen Rangliste.
        </div>
      </div>
    </Site>
  );
}
