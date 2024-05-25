import { OpenAIApi, Configuration } from "openai";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

async function isComplaint(question) {
    const messages = [
        { role: "system", content: "Determine if the following statement is a complaint:" },
        { role: "user", content: `Statement: "${question}"\nIs this statement a complaint? Answer 'yes' or 'no'."` },
    ];

    const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: messages,
        max_tokens: 10,
        temperature: 0.5,
    });

    return response.data.choices[0].message.content.trim().toLowerCase().includes("yes");
}

async function isFlirtingWithMinYong(question) {
    const messages = [
        { role: "system", content: "Determine if the following statement is flirtatious towards a person named Min Yong." },
        { role: "user", content: `Statement: "${question}"\nIs this statement flirtatious towards Min Yong? Answer 'yes' or 'no'."` },
    ];

    const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: messages,
        max_tokens: 10,
        temperature: 0.5,
    });

    return response.data.choices[0].message.content.trim().toLowerCase().includes("yes");
}

async function generateMinYongResponse(question, conversationHistory) {
    const conversationMessages = conversationHistory.map((msg) => ({
        role: msg.type === 'send' ? 'user' : 'assistant',
        content: msg.text
    }));

    const messages = [
        { role: "system", content: "You are a character named Min Yong, known for your cynical and straightforward responses. Respond to the following question in Min Yong's style, making sure to keep it under 60 characters." },
        ...conversationMessages,
        { role: "user", content: `Question: "${question}"\nResponse:` },
    ];

    const response = await openai.createChatCompletion({
        model: "gpt-4o-2024-05-13",
        messages: messages,
        max_tokens: 60,
        temperature: 0.7,
    });

    let answer = response.data.choices[0].message.content.trim();

    if (await isFlirtingWithMinYong(question)) {
        answer = "개수작 부리지 마.";
    } else if (await isComplaint(question)) {
        answer = "어쩌라고 " + answer;
    }

    return answer;
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
