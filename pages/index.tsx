import React from 'react';
import {Site} from '../components/Site';
import Link from 'next/link';
import {Route} from '../util/routes';
import {Title} from '../components/Title';
import {GPoints} from '../components/GPoints';

export default function Home() {
  return (
    <Site>
      <div className="flex">
        <div className="w-full max-w-2xl px-4 mt-16">
          <div className="text-5xl md:text-8xl font-bold">GNTMHUB</div>
          <div className="font-serif text-2xl py-2">
            Die Echtzeit-Plattform zu den Erfolgschancen der Germanys Next
            Topmodel Kandidatinnen.
          </div>
          <div className="text-xl py-2 font-bold opacity-70">
            Registriere dich und spiele mit!
          </div>
          <div className="flex my-8">
            <Link href={Route.LOGIN}>
              <div
                className="px-4 py-2 text-lg border border-pohutukawa-400 text-pohutukawa-400 font-bold rounded mr-4 cursor-pointer">
                Login
              </div>
            </Link>
            <Link href={Route.SIGNUP}>
              <div
                className="px-4 py-2 text-lg text-white font-bold bg-pohutukawa-400 rounded cursor-pointer">
                Registrieren
              </div>
            </Link>
          </div>
        </div>
        <img src="/model.svg" className="mt-20 w-20 md:w-40"/>
      </div>
      <div>
        <Title>Was ist GntmHub?</Title>
        <div>
          GntmHub ist eine Web-App mit der man virtuelle Punkte auf
          Kandidatinnen von GNTM wetten kann. Am besten überzeugt man ein paar
          Freunde mitzumachen, denn auf einer globalen Rangliste, kann man sich
          mit anderen Mitspielerinnen und Mitspielern vergleichen.
        </div>
        <Title>Wie funktioniert es?</Title>
        <div>
          Beim Erstellen eines Kontos bekommen Sie automatisch 1000 <GPoints/>.
          Die Spielerin oder der Spieler mit den meisten <GPoints/> am Ende der
          Staffel gewinnt. Sie können <GPoints/> über folgende drei Arten
          lukrieren:
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-6">
          {[
            {
              title: 'Aktienhandel',
              description: (
                <div>
                  Investieren Sie <GPoints/> in Aktien der Kandidatinnen!
                  Kaufen viele Spieler die Aktie, steigt deren Wert, verkaufen
                  viele Spieler die Aktie, sinkt deren Wert. Durch klugen Handel
                  können Sie Ihre <GPoints/> maximieren.
                </div>
              ),
            },
            {
              title: 'Dividenden',
              description: (
                <div>
                  Am Ende jeder Folge erhält jede Kandidatin, die im Rennen
                  bleibt, einen Pot von 30 <GPoints/> der anteilig auf alle
                  Aktionäre aufgeteilt wird. Aktien von Kandidatinnen, die
                  ausscheiden, werden wertlos.
                </div>
              ),
            },
            {
              title: 'Bonusrunden',
              description: (
                <div>
                  Gute Extra-
                  <GPoints/> erhalten Sie in Bonusrunden! Beantworten Sie
                  wöchentliche Fragen korrekt um womöglich den entscheidenden
                  Vorteil im Rennen um den ersten Platz zu erhaschen.
                </div>
              ),
            },
          ].map(element => (
            <div key={element.title} className="flex-1 p-4 border-pohutukawa-400  border rounded">
              <div className="text-2xl text-center pb-2 text-pohutukawa-400">
                {element.title}
              </div>
              <div children={element.description}/>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Title>Wie wird verhindert, dass frühe Mitspielende einen Vorteil erhalten?</Title>
        <div>
          Durch die Tatsache, dass Spielerinnen und Spieler durch ihren Aktienhandel den Markt stark
          beeinflussen, haben Personen, die früher Aktienhandel betreiben einen Vorteil. Dieser lässt sich nur
          schwer völlig verhindern. Allerdings wird versucht die Chancen etwas auszugleichen, indem
          Spielerinnen und Spieler
          bei Spielstart am 11.02.2021 nur 200 <GPoints></GPoints> erhalten und dieser Betrag im Laufe der
          kommenden Wochen auf das Startkapital von insgesamt 1000 <GPoints/> aufgestockt wird. Genaue
          Finanizierungspläne werden in den kommenden Tagen hier bekanntgegeben.
        </div>
      </div>
      <div>
        <Title>Wieso sollte ich früh auf erfolgreiche Kandidatinnen setzten?</Title>
        <div>
          Jede investierte Aktie eines Models verliert beim Ausscheiden des Models aus dem Wettbewerb ihren
          gesamten Wert.
          Um sichere Investitionen zu tätigen, wäre es also ratsam Aktien von Kandidatinnen zu kaufen, deren
          Fortbestand in dem Wettbewerb Sie als gesichert annehmen können.
        </div>
      </div>
      <div>
        <Title>Wieso sollte ich möglicherweise weniger erfolgreiche Kandidatinnen setzten?</Title>
        <div>
          Für jede Aktie einer Kandidatinnen die eine Runde weiter kommt, werden Dividenden ausgeschüttet.
          Diese sind mit einem Fixbetrag pro Kandidatin fixiert. Bei hoch gehandelten Kandidatinnen ist es
          schwieriger einen hohen Anteil an Aktien zu halten und damit verringert sich auch die
          Dividendenausschüttung. Im Gegensatz sind Aktien niedrig gehandelter Kandidatinnen günstig zu
          erwerben und retounieren Ihnen durch einen hohen Aktienanteil eine große Gewinnausschüttung. Gehen
          Sie dabei zu großes Risiko ein und setzen auf eine Kandidatin die ausscheidet, verlieren ihre
          Aktiven jeglichen Wert. Seien Sie also vorsichtig.
        </div>
      </div>
      <div>
        <Title>Wieso sollte ich überhaupt Aktien kaufen?</Title>
        <div>
          Aktien sind die Hauptquelle um Geld zu lukrieren. Wenn Sie einen guten Ranglistenplatz erreichen
          wollen, werden Sie um Aktienhandel nicht herumkommen.
        </div>
      </div>
      <div>
        <Title>Was geschieht wenn ich meine gesamten <GPoints/> verloren haben?</Title>
        <div>
          Dann können Sie nicht weiter mitspielen und scheiden aus dem Spiel aus. Es wäre also gut nicht ihr
          gesamtes Kapital risikobehaftet anzulegen.
        </div>
      </div>
    </Site>
  );
}
