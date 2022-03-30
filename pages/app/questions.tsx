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
        <div className="mx-auto max-w-xl py-6">

            {activeQuestions.map(question => <QuestionComponent
                key={question.id}
                question={question}
                setAnswer={(answer) => setAnswer(question.id, answer)}
            />)}
            <QuestionSubmission/>
            {questions
                .sort((a,b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
                .filter(question => !activeQuestions.map(q => q.id).includes(question.id)).map(question =>
                <QuestionComponent
                    key={question.id}
                    question={question}
                    setAnswer={(answer) => setAnswer(question.id, answer)}
                />)}
        </div>
    </Site>
}

export default Home
