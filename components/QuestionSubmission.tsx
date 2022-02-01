import {useState} from 'react';
import {post} from '../util/client';

export function QuestionSubmission() {

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

    return <div className={`border border-light bg-white rounded-xl shadow p-4 ${loading && 'pointer-events-none opacity-50'}`}>
        <div className="text-sm">Schlage eine Frage vor und erhalte g-points:</div>
        <div className="flex mt-1 space-x-2">
            <div className="w-full">
                <input
                    className="px-1 py-1 outline-none w-full bg-white"
                    placeholder="Wer hat die schönsten Haare?"
                    value={question}
                    onChange={({target}: { target: HTMLInputElement }) => setQuestion(target.value)}/>
                <div className={`flex flex-wrap ${question.length === 0 && 'hidden'}`}>
                    {options.map((option, index) => <input
                        key={index}
                        className="px-1 py-0.5 text-sm outline-none mt-1 mr-1 bg-white"
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