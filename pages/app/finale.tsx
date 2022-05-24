import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {post, useCandidateStore, useQuestionStore, useRequireLogin} from '../../util/client';

const Home: NextPage = () => {
    useRequireLogin();
    const [candidates] = useCandidateStore(store => [store.candidates, store.load()])
    const [questions] = useQuestionStore(store => [store.questions, store.load()])

    return <Site>
        <div className="w-full overflow-hidden">
            <div className="grid md:grid-cols-2 max-w-[1000px] mx-auto mt-16 border-b-2 border-light">
                <div className="text-7xl font-black font-display flex text-center items-center relative z-10">
                    <span>Es kann nur <span className="text-primary">Eine</span> geben</span>
                </div>
                <div className="">
                    {candidates.filter(c => !c.terminated).map(candidate => <div key={candidate.name}
                        className="w-14 md:w-20 h-96 inline-block relative">
                        <img src={candidate.picture} className="w-64 max-w-none absolute left-1/2 -translate-x-1/2"/>
                    </div>)}
                </div>
            </div>

            <div className="my-12 max-w-lg mx-auto">
                <div className="font-display font-bold text-xl">Das Finale steht an</div>
                <div>
                    Eine weitere Staffel Germanys: Es war forderend, es war lang, es war zach! Aber nun stehen wir hier
                    gemeinsam an der Ziellinie mit nur einer verbleibenden Frage: Wer gewinnt <span
                    className="font-display font-bold">GNTMHUB</span> und sichert sich
                    damit Ruhm und Ehre für die kommenden Jahre?
                </div>
            </div>

            <div className="my-12 max-w-lg mx-auto">
                <div className="font-display font-bold text-xl">Alles anders</div>
                <div>
                    Im Finale wird alles anders. Die gesamte Staffel hindurch musste mit Bedacht gespielt werden um sich
                    wertvolle g-points zu sichern. Am Ende geht es nur noch um den absoluten, alleinigen Sieg. Folgendes
                    ist anders:
                    <div className="flex my-4">
                        <div className="text-primary font-bold text-4xl font-display px-4 py-2">1</div>
                        <div><span className="font-display">Spontante Handelssperren.</span> Während den Folgen besteht
                            keine generelle Handelssperre. Nur in Situationen, bei denen
                            eine Termination unmittelbar bevorsteht, wird eine spontane Handelssperre für wenige Minuten
                            verhängt, damit unterschiedliche Netzwerklatenz keine Vorteile verschafft. Man sollte also
                            auch während dem Finale das Handy griffbereit halten.
                        </div>
                    </div>
                    <div className="flex my-4">
                        <div className="text-primary font-bold text-4xl font-display px-4 py-2">2</div>
                        <div><span className="font-display">Terminationsboost.</span> Nachdem eine Kandidatin
                            ausscheidet, wird der Aktienwert der verbleibenden Kandidatinnen künstlich um 10 g-points
                            angehoben. Richtige Investionen zahlen sich also wirklich aus. Man sollte sich gut
                            überlegen ob man g-points uninvestiert auf dem Konto
                            lässt.
                        </div>
                    </div>
                    <div className="flex my-4">
                        <div className="text-primary font-bold text-4xl font-display px-4 py-2">3</div>
                        <div><span className="font-display">Performance-Fokus.</span> In der letzten Folge werden
                            ausnahmsweise keine Fragen gestellt, sodass der Fokus einzig und allein der Performance der
                            Kandidatinnen gewidment werden kann.
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-12 max-w-lg mx-auto">
                <div className="font-display font-bold text-xl">Das Ende einer Ära/Staffel</div>
                <div>
                    Nachdem das Finale endet und die Siegerin oder der Sieger feststeht, kehren wir zurück in unsere
                    trieten, langweiligen Leben. Das ganze <span
                    className="font-display font-bold">GNTMHUB</span>-Team bedankt sich herzlichst für die gemeinsame
                    Zeit, die wir nicht nur dieser kurzweiligen Sendung geschenkt haben, sondern vor allem der
                    Gemeinschaft an Menschen, die über diese Plattform zueinander gefunden hat.<br/>
                    Wir hoffen es hat ein wenig Spaß gemacht. Wir freuen uns inständig auf ein Wiedersehen im neuen Jahr hier auf <span
                    className="font-display font-bold">GNTMHUB</span>.
                </div>


                <div className="flex justify-end">
                    <img src={"/signature.svg"} className="mt-12 w-64 dark:invert dark-invert"/>
                </div>

            </div>


        </div>
    </Site>
}

export default Home
