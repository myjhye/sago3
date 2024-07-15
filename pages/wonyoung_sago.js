import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { FaPaperPlane } from 'react-icons/fa';

export default function WonyoungSago() {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastMessageDate, setLastMessageDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
    const messageEndRef = useRef(null);

    useEffect(() => {
        const currentDate = new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        setLastMessageDate(currentDate);
    }, []);

    useEffect(() => {
        // 새로운 메시지가 추가될 때 최신 메시지로 스크롤
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading]);

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
        setMessages([
            ...messages,
            {
                type: 'send',
                text: question,
                time: currentTime,
                date: currentDate
            }
        ]);
        setQuestion('');

        const res = await fetch(`/api/wonyoung_answer`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question, conversationHistory: messages })
        });

        const json = await res.json();
        setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'receive', text: json.response, time: currentTime, date: currentDate }
        ]);
        setLoading(false);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleClick();
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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
                    <img
                        src="https://i.ibb.co/rtf0wqM/2024-07-14-1-19-08.png"
                        alt="profile"
                        className="w-10 h-10 rounded-full mr-2 cursor-pointer"
                        onClick={openModal}
                    />
                    <h1 className="text-2xl font-bold">워녕이🎀</h1>
                </div>
            </div>
            <div className="flex flex-col items-start w-full pt-24">
                <div className="mb-5 w-full overflow-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
                    {messages.map((msg, index) => (
                        <div key={index} className="mb-8">
                            {(index === 0 || msg.date !== messages[index - 1].date) && (
                                <div className="text-center w-full">
                                    <hr />
                                    <p className="text-gray-500 mt-2">{msg.date}</p>
                                </div>
                            )}

                            <div className={`flex ${msg.type === 'send' ? 'justify-end' : 'justify-start'} items-start my-2 w-full`}>
                                {msg.type === 'receive' && (
                                    <div className="flex flex-col items-start mr-2">
                                        <img
                                            src="https://i.ibb.co/rtf0wqM/2024-07-14-1-19-08.png"
                                            alt="profile"
                                            className="w-10 h-10 rounded-full cursor-pointer"
                                            style={{ alignSelf: 'flex-start', marginTop: '-10px' }}
                                            onClick={openModal}
                                        />
                                    </div>
                                )}
                                {msg.type === 'send' && (
                                    <span className="self-end text-xs text-gray-500 mr-2">{msg.time}</span>
                                )}
                                <div className={`relative flex flex-col items-start max-w-[60%] rounded-lg p-2 ${msg.type === 'send' ? 'bg-pink-200' : 'bg-white'}`}>
                                    {msg.type === 'receive' && (
                                        <p className="absolute top-[-23px] left-0 text-sm text-gray-600">워녕이🎀</p>
                                    )}
                                    <p className="ml-2 text-black break-words mb-2 text-left" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                                        {msg.text}
                                    </p>
                                </div>
                                {msg.type === 'receive' && (
                                    <span className="self-end text-xs text-gray-500 ml-2">{msg.time}</span>
                                )}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex items-start my-2 w-full">
                            <img src="https://i.ibb.co/rtf0wqM/2024-07-14-1-19-08.png" alt="profile" className="w-10 h-10 rounded-full mr-2" />
                            <div className="relative max-w-[60%]">
                                <div className="bg-gray-200 rounded-lg px-4 py-2 inline-block">
                                    <div className="flex space-x-1">
                                        <div className="bg-gray-400 w-2 h-2 rounded-full animate-pulse"></div>
                                        <div className="bg-gray-400 w-2 h-2 rounded-full animate-pulse delay-75"></div>
                                        <div className="bg-gray-400 w-2 h-2 rounded-full animate-pulse delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messageEndRef}></div>
                </div>
                <div className="fixed bottom-0 left-0 right-0 bg-white p-2 border-t border-gray-300 flex w-full items-center z-10">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="원영이와 대화하기"
                        className="flex-grow p-2 rounded-l-full border border-gray-300 resize-none"
                        rows={1}
                        style={{ overflow: 'hidden' }}
                    />
                    <button className="btn bg-pink-500 text-white rounded-r-full px-4 py-3 items-center" onClick={handleClick}>
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg relative">
                        <button 
                            className="absolute top-2 right-2 text-black" 
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                        <img
                            src="https://i.ibb.co/rtf0wqM/2024-07-14-1-19-08.png"
                            alt="profile"
                            className="w-full h-full rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
