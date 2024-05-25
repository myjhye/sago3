import { useState } from 'react';
import Head from 'next/head';

export default function MinyongSago() {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const bubbleImages = {
        send: {
            1: '/text_bullon/send_1.png',
            2: '/text_bullon/send_2.png',
            3: '/text_bullon/send_3.png',
            4: '/text_bullon/send_4.png',
            5: '/text_bullon/send_5.png'
        },
        receive: {
            1: '/text_bullon/receive_1.png',
            2: '/text_bullon/receive_2.png',
            3: '/text_bullon/receive_3.png',
            4: '/text_bullon/receive_4.png',
            5: '/text_bullon/receive_5.png',
        }
    };

    const getSendBubbleImage = (text) => {
        const length = text?.length || 0;
        if (length < 5) return bubbleImages.send[1];
        if (length < 10) return bubbleImages.send[2];
        if (length < 20) return bubbleImages.send[3];
        if (length < 70) return bubbleImages.send[5];
        return bubbleImages.send[5];
    };

    const getReceiveBubbleImage = (text) => {
        const length = text?.length || 0;
        if (length < 10) return bubbleImages.receive[2];
        if (length < 30) return bubbleImages.receive[4];
        if (length < 70) return bubbleImages.receive[5];
        return bubbleImages.receive[5];
    };

    const handleClick = async () => {
        if (question.trim() === '') return;

        setLoading(true);
        setMessages([...messages, { type: 'send', text: question }]);
        setQuestion('');

        const res = await fetch(`/api/minyong_answer`, {
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
                <img src="/minyong_profile2.png" alt="profile" className="w-10 h-10 rounded-full mr-2" />
                <h1 className="text-2xl font-bold">이민용</h1>
            </div>
            <div className="flex flex-col items-start w-full">
                <div className="mb-5 w-full">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.type === 'send' ? 'justify-end' : 'justify-start'} items-center my-2 w-full`}>
                            {msg.type === 'receive' && (
                                <img src="/minyong_profile2.png" alt="profile" className="w-10 h-10 rounded-full mr-2" />
                            )}
                            <div className="relative max-w-[60%]">
                                <img 
                                    src={msg.type === 'send' ? getSendBubbleImage(msg.text) : getReceiveBubbleImage(msg.text)} 
                                    alt={msg.type} 
                                    className="w-full h-auto"
                                />
                                <p className="absolute top-1/2 left-2 transform -translate-y-1/2 m-0 text-black break-words p-2 w-[calc(100%-20px)]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
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
                        placeholder="민용이와 대화하기"
                        maxLength={60}
                        className="flex-grow p-2 rounded-l-full border border-gray-300"
                    />
                    <button className="btn bg-blue-500 text-white rounded-r-full px-4 py-2" onClick={handleClick}>
                        전송
                    </button>
                </div>
                <div className="text-gray-500 text-sm mb-5">
                    {question.length}/60
                </div>
            </div>
        </div>
    )
}
