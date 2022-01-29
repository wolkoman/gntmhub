import {Question} from '@prisma/client'
import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {QuestionSubmission} from '../../components/QuestionSubmission';
import {Question as QuestionComponent} from '../../components/Question';
import {post, useCandidateStore, useQuestionStore, useRequireLogin, useUserStore} from '../../util/client';
import {useLeaderboardStore} from '../../util/client/useLeaderboardStore';
import {price} from '../../util/market';
import {useEffect} from 'react';

const Home: NextPage = () => {
    useRequireLogin();
    return <Site>
        <div className="max-w-xl mx-auto text-lg my-10">
            <div className="font-display font-bold text-3xl my-4">Hey Topmodel!</div>
            <div className="text-xl">
                Willkomen zu einer weiteren Staffel Topmodel und zu einem weiteren Spiel auf GNTMHUB. Die Regeln haben sich nur leicht geändert. Hier das Wichtigste:
            </div>
            <div className="font-display font-bold mt-6">G-Points erhalten!</div>
            <div>
                G-Points bekommt man (1.) über klugen Handel. Kaufe Aktien von Model die noch lange dabei sind und verkaufe Aktien von Model die bald ausscheiden. (2.) Außerdem über das Beantworten von Fragen. Am Donnerstag um 18:00 Uhr sind die Fragen spätestens online. Für richtige Antworten gibts Punkte! Auch wenn man Fragen einreicht (und sie verwendet werden) gibt es Punkte.
            </div>
            <div className="font-display font-bold mt-6">Initiale Points!</div>
            <div>
                Aber moment, wie kauft man Aktien wenn man noch gar keine G-Points hat. Keine Sorge, da kann ich helfen. Ab Donnerstag 03. Feburuar 2022 werden jeweils um 18:00 Uhr wochentags 10 g-points an alle Spieler:innen ausgeschüttet. Das geht solange bis insgesamt 500 g-points ausbezahlt wurden (ca. 3 Monate).
            </div>
            <div className="font-display font-bold mt-6">Aktiensperren</div>
            <div>
                Letztes Jahr hat es während den Folgen eine Handelssperre gegeben. Ob es sie dieses Jahr wieder gibt habe ich mir noch nicht überlegt. Infos gibts spätestens am 03.02.2022 hier!
            </div>
            <div className="font-display font-bold mt-6">Das wars?</div>
            <div>
                Am Anfang gibt es nur grundlegenden Funktionen auf GNTMHUB. Im Laufe der Staffel kommen sicher noch Funktionen hinzu. Sie werden hier veröffentlicht. Für ein kleines Easter-Egg könnt ihr aber jetzt `darkmode` tippen.
            </div>

        </div>
    </Site>
}

export default Home
