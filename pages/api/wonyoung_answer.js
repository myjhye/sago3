import { OpenAIApi, Configuration } from "openai";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

async function generateMinYongResponse(question, conversationHistory) {
    const conversationMessages = conversationHistory.map((msg) => ({
        role: msg.type === 'send' ? 'user' : 'assistant',
        content: msg.text
    }));

    const messages = [
        { role: "system", content: "너는 밝고 긍정적이며 배려심 깊은 답변으로 유명한 '원영'이라는 캐릭터야. 다음 질문에 원영 스타일로 대답해줘. 답변을 65자 이내로 반말로 해줘. '너' 대신 '웅니'를 사용해." },
        ...conversationMessages,
        { role: "user", content: question },
    ];
    

    const completion = await openai.createChatCompletion({
        model: "gpt-4o-2024-05-13",
        messages: messages,
        max_tokens: 60,
    });

    return completion.data.choices[0].message.content;
}

export default async function handler(req, res) {
    try {
        const { question, conversationHistory } = req.body;
        const response = await generateMinYongResponse(question, conversationHistory);
        res.status(200).json({ response: response });
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: error.message });
    }
}
