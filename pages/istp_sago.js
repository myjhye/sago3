import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FaPaperPlane } from 'react-icons/fa';

export default function MinyongSago() {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastMessageDate, setLastMessageDate] = useState('');

    useEffect(() => {
        const currentDate = new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        setLastMessageDate(currentDate);
    }, []);

    const handleClick = async () => {
        if (question.trim() === '') return;

        const currentTime = new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        const currentDate = new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        setLoading(true);
        setMessages([...messages, { type: 'send', text: question, time: currentTime, date: currentDate }]);
        setQuestion('');

        const res = await fetch(`/api/istp_answer`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question, conversationHistory: messages })
        });

        const json = await res.json();
        setMessages((prevMessages) => [...prevMessages, { type: 'receive', text: json.response, time: currentTime, date: currentDate }]);
        setLoading(false);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleClick();
        }
    };

    return (
        <div className="text-center p-5 bg-gray-100 min-h-screen">
            <Head>
                <style>
                    {`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap');`}
                </style>
            </Head>
            <div className="fixed top-0 left-0 right-0 bg-white p-2 shadow-md z-10">
                <div className="flex items-center justify-center mt-2 mb-2">
                    <h1 className="text-2xl font-bold">
                        ISTP
                    </h1>
                </div>
            </div>
            <div className="flex flex-col items-start w-full pt-24">
                <div className="mb-5 w-full">
                    {messages.map((msg, index) => (
                        <div key={index} className="mb-8">
                            {(index === 0 || msg.date !== messages[index - 1].date) && (
                                <div className="text-center w-full">
                                    <hr />
                                    <p className="text-gray-500 mt-2">
                                        {msg.date}
                                    </p>
                                </div>
                            )}
                            <div className={`flex ${msg.type === 'send' ? 'justify-end' : 'justify-start'} items-start my-2 w-full`}>
                                {msg.type === 'receive' && (
                                    <div className="flex flex-col items-start mr-2">
                                        <img src="https://i.ibb.co/pKpb1kR/istp.png" alt="profile" className="w-10 h-10 rounded-full" style={{ alignSelf: 'flex-start', marginTop: '-10px' }} />
                                    </div>
                                )}
                                {msg.type === 'send' && (
                                    <span className="self-end text-xs text-gray-500 mr-2">{msg.time}</span>
                                )}
                                <div className={`relative flex flex-col items-start max-w-[60%] rounded-lg p-2 ${msg.type === 'send' ? 'bg-green-200' : 'bg-white'}`}>
                                    {msg.type === 'receive' && (
                                        <p className="absolute top-[-23px] left-0 text-sm text-gray-600">
                                            ISTP
                                        </p>
                                    )}
                                    <p className="ml-2 text-black break-words mb-2 text-left" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                                        {msg.text}
                                    </p>
                                </div>
                                {msg.type === 'receive' && (
                                    <span className="self-end text-xs text-gray-500 ml-2">
                                        {msg.time}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-end my-2 w-full">
                            <div className="relative max-w-[60%]">
                                <div className="bg-gray-200 rounded-full px-4 py-2 inline-block">
                                    <p className="m-0 text-gray-500" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                                        Sending...
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="fixed bottom-0 left-0 right-0 bg-white p-2 border-t border-gray-300 flex w-full items-center z-10">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="잇팁과 대화하기"
                        className="flex-grow p-2 rounded-l-full border border-gray-300"
                    />
                    <button className="btn bg-green-500 text-white rounded-r-full px-4 py-3 items-center" onClick={handleClick}>
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
    )
}
