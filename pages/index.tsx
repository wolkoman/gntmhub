import React from "react";
import {Site} from "../components/Site";
import Link from "next/link";
import {Route} from "../util/routes";
import {Title} from "../components/Title";
import {GPoints} from "../components/GPoints";

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
                        Eingeschränkter Spielstart am 11. Februar
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
                            title: "Aktienhandel",
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
                            title: "Dividenden",
                            description: (
                                <div>
                                    Am Ende jeder Folge erhält jede Kandidatin, die im Rennen
                                    bleibt, einen Pot von 50 <GPoints/> der anteilig auf alle
                                    Aktionäre aufgeteilt wird. Aktien von Kandidatinnen, die
                                    ausscheiden, werden wertlos.
                                </div>
                            ),
                        },
                        {
                            title: "Bonusrunden *",
                            description: (
                                <div>
                                    Gute Extra-
                                    <GPoints/> erhalten Sie in Bonusrunden! Beantworten Sie
                                    wöchentliche Fragen korrekt um womöglich den entscheidenden
                                    Vorteil im Rennen um den ersten Platz zu erhaschen.

                                    <div className="opacity-80">* Diese Funktionalität wird vorraussichtlich mit 04.
                                        März zur Verfügung stehen.</div>
                                </div>
                            ),
                        },
                    ].map(element => (
                        <div className="flex-1 p-4 border-pohutukawa-400  border rounded">
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
                    schwer völlig verhindern. Allerdings wird versucht die Chancen etwas auszugleichen, indem Spielerinnen und Spieler
                    bei Spielstart am 11.02.2021 nur 200 <GPoints></GPoints> erhalten und dieser Betrag im Laufe der
                    kommenden Wochen auf das Startkapital von insgesamt 1000 <GPoints/> aufgestockt wird. Genaue
                    Finanizierungspläne werden in den kommenden Tagen hier bekanntgegeben.
                </div>
            </div>
        </Site>
    );
}
