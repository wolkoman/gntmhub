import {Candidate} from '@prisma/client'
import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {useRequireLogin} from '../../util/requireLogin';
import {useCandidateStore} from '../../util/store';
import {calculateStockPrice, price} from '../../util/market';
import {useState} from 'react';
import {Buying} from '../../components/Buying';
import {post} from '../../util/fetch';

function QuestionSubmission() {

    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['Option 1', 'Option 2']);

    function submit() {
        setLoading(true);
        post('/api/intern/submit-question', {question, options}).then(() => {
            setQuestion('');
            setOptions(['Option 1', 'Option 2']);
        });
    }

    return <div className={`bg-light p-4 ${loading && 'pointer-events-none opacity-50'}`}>
        <div>Schlage eine Frage vor und erhalte g-points:</div>
        <div className="flex mt-4 space-x-2">
            <div className="w-full">
                <input
                    className="px-2 py-1 outline-none text-lg w-full"
                    placeholder="Wer hat die schönsten Haare?"
                    value={question}
                    onChange={({target}: { target: HTMLInputElement }) => setQuestion(target.value)}/>
                <div className={`flex flex-wrap ${question.length === 0 && 'hidden'}`}>
                    {options.map((option, index) => <input
                        key={index}
                        className="px-1 py-0.5 text-sm outline-none mt-1 mr-1"
                        value={option}
                        onChange={({target}: { target: HTMLInputElement }) => setOptions(x => {
                            return x.map((o, i) => i === index ? target.value : o).filter(o => o !== '');
                        })}/>)}
                    <button
                        className="bg-white text-dark text-white px-3 mt-1 font-display"
                        onClick={() => setOptions(x => [...x, 'Option'])}>+
                    </button>
                </div>
            </div>
            <button
                className={`bg-dark text-white px-4 font-display ${question.length > 10 && options.length >= 2 ? '' : 'pointer-events-none opacity-50'}`}
                onClick={() => submit()}>Absenden
            </button>
        </div>
    </div>;
}

const Home: NextPage = () => {
    useRequireLogin();

    return <Site>
        <QuestionSubmission/>
    </Site>
}

export default Home
