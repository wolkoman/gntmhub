import React from 'react';
import {Site} from '../components/Site';

export default function Impressum() {
  return (
    <Site>
      <div className="mx-auto max-w-xl text-lg">
        <div className="text-6xl font-bold text-center">Das große Finale</div>
        <div className="text-pohutukawa-400 text-center bold text-xl mb-12 italic">Wie es abläuft und wie es weiter
          geht.
        </div>

        <div className="font-serif text-2xl font-bold my-2 mt-10">Dem Horten Einhalt gebieten</div>
        <div className="my-1">In den letzten Wochen hat sich viel getan. Einige haben spekuliert, andere auf Nummer
          sicher gespielt; einige haben gewonnen, andere haben verloren. Doch egal wie gut oder schlecht die
          Ausgangsituation ist, alle haben noch gute Chancen einige Ranglisten-Plätze nach oben zu klettern.
        </div>
        <div className="my-1">Damit wir sicherstellen können, dass reichere Spieler:innen sich nicht auf den Lorbeeren
          ausruhen, gibt es im Finale eine Neuheit: <span
            className="text-pohutukawa-400 font-bold dark:text-pohutukawa-200">den Horterabzug</span>. Bei jeder Kandidatin die ausscheidet (das
          sind noch drei) wird jedem Spielenden 20% seiner liquiden Punkteabzahl abgezogen. Damit möchten wir verhinden,
          dass die G-Points in der letzten Folge nur noch auf dem Konto liegen, sondern weiterhin in Aktien investiert
          werden.
        </div>

        <div className="font-serif text-2xl font-bold my-2 mt-10">Ein Hoch auf den freien Markt</div>
        <div className="my-1">Während den Folgen hat bis jetzt immer eine Handelssperre bestanden; nicht so im Finale!
          Die ganze Zeit über kann <span
            className="text-pohutukawa-400 font-bold dark:text-pohutukawa-200">frei gehandelt</span> werden, sodass sich die individuelle Performanz jeder Kandidatin sofort in ihren Aktien niederschlagen kann. Die einzige Ausnahme besteht in Entscheidungssituationen. Sobald eine Entscheidungssituation beginnt (also das Ausscheiden einer Kandidatin unmittelbar bevorsteht), wird der Handel gesperrt und erst anschließend wieder freigegeben.
        </div>

        <div className="font-serif text-2xl font-bold my-2 mt-10">Ehre, dem Ehre gebührt</div>
        <div className="my-1">Vielen Dank fürs Handeln, Beantworten, Spekulieren und Mitfiebern. Bei <span
          className="font-serif">gntmhub</span> mitzumachen erfordert <span
          className="text-pohutukawa-400 font-bold dark:text-pohutukawa-200">Ausdauer</span> (schließlich dauert das ganze schon viele Monate), <span
          className="text-pohutukawa-400 font-bold dark:text-pohutukawa-200">Mut</span> (um sich auf den Genuss einer so oberflächlichen Sendung einzulassen) und natürlich sehr viel <span
          className="text-pohutukawa-400 font-bold dark:text-pohutukawa-200">Personality</span>. Die ersten Plätze werden als Entlohnung für ihre eindrucksvolle Hingabe auch ein kleines Geschenk enthalten. Diese werden in den nächsten Tagen persönlich per SMS verständigt. Ich hoffe dieses kleine Spiel war eine angenehme Abwechslung zu dem alltäglichen Arbeitsstress, Lernzwang und Liebeskummer.</div>

          <div className="font-serif text-2xl font-bold my-2 mt-10">Es kann nur eine:n geben</div>
          <div className="my-1">
          <span
          className="font-serif">gntmhub</span> soll es nächstes Jahr auf jeden Fall wieder geben. Ich würde mich sehr freuen wenn sich wieder einige entschließen mitzuspielen. Für das Finale wünsche ich gute Unterhaltung und bin gespannt auf den/die Gewinner:in. Schließlich <span
          className="text-pohutukawa-400 font-bold dark:text-pohutukawa-200">kann es nur eine:n geben!</span>
        </div>

        <div className="text-right font-serif italic mt-12">- Manuel</div>
      </div>
    </Site>
  );
}
