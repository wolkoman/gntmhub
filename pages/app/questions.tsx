import {Question} from '@prisma/client'
import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {QuestionSubmission} from '../../components/QuestionSubmission';
import {Question as QuestionComponent} from '../../components/Question';
import {useQuestionStore, useRequireLogin} from '../../util/client';

const Home: NextPage = () => {
    useRequireLogin();
    const [questions, setAnswer] = useQuestionStore(store => [store.questions, store.setMyAnswer, store.load()])

    return <Site>
        <div className="py-4">
            <div className="font-display w-60 mx-auto my-24 text-center">
                Die ersten Fragen werden am Donnerstag um spätestens 18:00 Uhr veröffentlicht.
            </div>
            {questions.map(question => <QuestionComponent key={question.id} question={question} setAnswer={(answerId) => setAnswer(question.id, answerId)}/>)}
        </div>
        <QuestionSubmission/>
    </Site>
}

export default Home
