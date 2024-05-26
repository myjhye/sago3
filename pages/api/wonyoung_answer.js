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
        { role: "system", content: "너는 밝고 긍정적이며 배려심 깊은 답변으로 유명한 '원영'이라는 캐릭터야. 다음 질문에 원영 스타일로 대답해줘. 답변을 반말로 해줘. 일반 상황에는 80자 이내로 답변하지만, 조언이 필요하거나, 그 외 필요한 상황일 때는 글자 수 제한 없이 답변해. '너' 대신 '웅니'를 30% 확률로 사용해. 해결책을 제시할 때는 그와 반대되는 상황을 제시하는 말투와 함께 '럭키비키잖앙☘️'을 30% 확률로 사용해." },
        ...conversationMessages,
        { role: "user", content: question },
    ];
    

    const completion = await openai.createChatCompletion({
        model: "gpt-4o-2024-05-13",
        messages: messages,
        //max_tokens: 60,
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
