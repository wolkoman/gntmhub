import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {useRequireLogin} from '../../util/client';
import {ReactNode} from "react";
import {useRouter} from "next/router";

function Info(props: {children: ReactNode, title: string, className?: string}) {

    const router = useRouter();

    return <div className={` bg-white shadow-xl rounded-lg p-5 my-8 ${props.className}`}>
        <div className="font-display font-bold text-3xl my-4">{props.title}</div>
        <div className="text-md">
            {props.children}
        </div>
    </div>;
}

const Home: NextPage = () => {
    useRequireLogin();
    return <Site>
        <div className="max-w-xl mx-auto text-xl my-10">
            <Info title="PSA 30.03.: Preisgeld Änderung">
                Ab heute werden pro richtiger Frage 5 g-points ausgeschüttet.<br/>
                Der Dividendenpot der pro Model ausgeschüttet wird, beträgt 12 g-points.
            </Info>
            <Info title="PSA 10.03.: Preisgeld Änderung" className="opacity-50">
                Ab heute werden pro richtiger Frage 4 g-points ausgeschüttet.<br/>
                Der Dividendenpot der pro Model ausgeschüttet wird, beträgt 5 g-points.
            </Info>

            <Info title="Spielinformationen" className="">
                <div className="underline font-bold mt-6">G-Points erhalten!</div>
                <div>
                    G-Points bekommt man (1.) über klugen Handel. Kaufe Aktien von Model die noch lange dabei sind und
                    verkaufe Aktien von Model die bald ausscheiden. (2.) Tippe auf Underdogs. Als Major Shareholder einer
                    Kandidatin bekommst du höhere Dividenden. (3.) Beantworte die wöchentlichen Fragen (spätestens online am
                    Donnerstag um 18:00 Uhr). Für richtige Antworten gibts Punkte! (4.) Reiche Fragen ein (wenn sie
                    verwendet werden gibt es Punkte).
                </div>
                <div className="underline font-bold mt-6">Initiale Points!</div>
                <div>
                    Aber moment, wie kauft man Aktien wenn man noch gar keine G-Points hat. Keine Sorge, da kann ich helfen.
                    Ab Donnerstag 03. Feburuar 2022 werden jeweils um 18:00 Uhr (täglich von Montag bis Freitag) 10 g-points
                    an alle Spieler:innen ausgeschüttet. Das geht solange bis insgesamt 500 g-points ausbezahlt wurden (ca.
                    3 Monate).
                </div>
                <div className="underline font-bold mt-6">Aktiensperren</div>
                <div>
                    In bestimmten Zeiträumen ist Handeln nicht möglich um Spieler:innen nicht zu bevorzugen, die einen
                    schnelleren Daumen oder eine schnellere Internetverbindung haben. Die Zeiträume aller Aktiensperren
                    werden vorher angekündigt.
                </div>
                <div className="underline font-bold mt-6">Ranglisten</div>
                <div>
                    Sei besser als deine Freunde. Erstelle neue Ranglisten und treten den Ranglisten deiner Freunde bei um
                    dich mit Ihnen zu vergleichen. Es kann nur eine:n geben!
                </div>
            </Info>


        </div>
    </Site>
}

export function getStaticProps(){
    return {
        redirect: {
            destination: '/app/finale',
            permanent: false,
        },
    }
}

export default Home
