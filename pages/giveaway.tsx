import React from 'react';
import {Site} from '../components/Site';
import Link from 'next/link';
import {Route} from '../util/routes';
import {GPoints} from '../components/GPoints';

export default function Home() {
  return (
    <Site>
      <div className="text-lg text-pohutukawa-300 pl-2 pt-12">AKTION AM 18.02.2021</div>
      <div className="text-6xl font-serif pb-6">GPoints für alle!</div>
      <div className="py-4">
        Am Donnerstag, den 18.02.2021 werden jeweils um 16:00, 17:00 und 18:00 Uhr (UTC+1) jeweils 100 <GPoints/> an alle
        Mitspielerinnen und Mitspieler ausgeschüttet. Ingesamt werden Sie an diesem Abend also insgesamt
        300 <GPoints/> mehr auf ihrem Konto haben. Dies ist eine Maßnahme der verlangsamten Initalkapitalausschüttung,
        um die Vorteile, die Spielerinnen und Spieler durch einen frühzeitigen Handel erlangt haben, zu minimieren. Für
        einen maximalen Vorteil sollten Sie pünktlich zur Ausschüttung Handel betreiben um von den vergleichsweisen
        günstigen Aktienwerte zu profitieren.
      </div>
      <div className="py-4">
        Im Zuge dieser Maßnahme wurde der Dividendenpot jeder Kandidatinnen auch auf 30 <GPoints/> reduziert, um den
        überhöhten Wert früh erlangter Aktien auszugleichen.
      </div>
      <Link href={Route.LOGIN}>
      <div className="font-serif border border-black inline-block py-2 px-3 cursor-pointer">
        zum Login
      </div></Link>
    </Site>
  );
}
