import {Question} from '@prisma/client'
import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {QuestionSubmission} from '../../components/QuestionSubmission';
import {Question as QuestionComponent} from '../../components/Question';
import {useQuestionStore, useRequireLogin} from '../../util/client';

const Home: NextPage = () => {
    useRequireLogin();
    const [questions, setAnswer] = useQuestionStore(store => [store.questions, store.setMyAnswer, store.load()])
    const activeQuestions = questions
        .filter(question => new Date(question.deadline).getTime() > new Date().getTime())
        .filter(question => question.Answer.length === 0);

    return <Site>
        <div className="mx-auto max-w-xl">
        {activeQuestions.length === 0 && <div className="py-4">
            <div className="font-display w-60 mx-auto my-24 text-center">
                Weitere Fragen werden am nächsten Donnerstag um spätestens 18:00 Uhr veröffentlicht.
            </div>
        </div>}

        {activeQuestions.map(question => <QuestionComponent
                key={question.id}
                question={question}
                setAnswer={(answer) => setAnswer(question.id, answer)}
            />)}
        <QuestionSubmission/>
        {questions.filter(question => !activeQuestions.map(q => q.id).includes(question.id)).map(question => <QuestionComponent
            key={question.id}
            question={question}
            setAnswer={(answer) => setAnswer(question.id, answer)}
        />)}
        </div>
    </Site>
}

export default Home
