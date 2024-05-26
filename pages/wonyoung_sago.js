import { useState } from 'react';
import Head from 'next/head';
import { FaPaperPlane } from 'react-icons/fa';

export default function WonyoungSago() {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (question.trim() === '') return;

        setLoading(true);
        setMessages([...messages, { type: 'send', text: question }]);
        setQuestion('');

        const res = await fetch(`/api/wonyoung_answer`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question, conversationHistory: messages })
        });

        const json = await res.json();
        setMessages((prevMessages) => [...prevMessages, { type: 'receive', text: json.response }]);
        setLoading(false);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleClick();
        }
    };

    return (
        <div className="text-center p-5">
            <Head>
                <style>
                    {`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap');`}
                </style>
            </Head>
            <div className="flex items-center justify-center mb-5">
                <img src="https://i.ibb.co/QJL4hr9/Fsn-Q5-J8a-EAEi-EUA.jpg" alt="profile" className="w-10 h-10 rounded-full mr-2" />
                <h1 className="text-2xl font-bold">워녕이🎀</h1>
            </div>
            <div className="flex flex-col items-start w-full">
                <div className="mb-5 w-full">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.type === 'send' ? 'justify-end' : 'justify-start'} items-start my-2 w-full`}>
                            {msg.type === 'receive' && (
                                <div className="flex flex-col items-start mr-2">
                                    <img src="https://i.ibb.co/QJL4hr9/Fsn-Q5-J8a-EAEi-EUA.jpg" alt="profile" className="w-10 h-10 rounded-full" />
                                    
                                </div>
                            )}
                            <div className={`relative flex items-start max-w-[60%] rounded-lg p-2 ${msg.type === 'send' ? 'bg-pink-100' : 'bg-gray-100'}`}>
                                {msg.type === 'receive' && (
                                    <p className="absolute top-[-20px] left-0 text-sm text-gray-600">워녕이🎀</p>
                                )}
                                <p className="ml-2 text-black break-words" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                                    {msg.text}
                                </p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-end my-2 w-full">
                            <div className="relative max-w-[60%]">
                                <div className="bg-gray-200 rounded-full px-4 py-2 inline-block">
                                    <p className="m-0 text-gray-500" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>Sending...</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex w-full items-center mb-2">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="원영이와 대화하기"
                        className="flex-grow p-2 rounded-l-full border border-gray-300"
                    />
                    <button className="btn bg-blue-500 text-white rounded-r-full px-4 py-3 items-center" onClick={handleClick}>
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
    )
}