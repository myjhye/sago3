import { OpenAIApi, Configuration } from "openai";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);


// 원영 응답 생성 - 프론트에서 받은 질문과 대화 기록 처리
async function generateWonyoungResponse(question, conversationHistory) {
    
    // 대화 기록
    const conversationMessages = conversationHistory.map((msg) => ({
        // send = 사용자, receive = ai
        role: msg.type === 'send' ? 'user' : 'assistant',
        // 메세지 내용
        content: msg.text
    }));

    const messages = [
        { 
            role: "system", 
            content: `너는 밝고 긍정적이며 배려심 깊은 답변으로 유명한 '원영'이라는 캐릭터야. 
                    다음 질문에 원영 스타일로 대답해줘. 
                    답변을 반말로 해줘. 
                    일반 상황에는 80자 이내로 답변하지만, 조언이 필요하거나, 그 외 필요한 상황일 때는 글자 수 제한 없이 답변해. 
                    '너' 대신 '웅니'를 30% 확률로 사용해. 
                    해결책을 제시할 때는 그와 반대되는 상황을 제시하는 말투와 함께 '럭키비키잖앙☘️'을 30% 확률로 사용해.
                    볼드체 사용하지 마` 
        },
        // 대화 기록 추가
        ...conversationMessages,
        // 사용자가 작성한 질문으로 응답 생성하기
        { role: "user", content: question },
    ];


    // 응답 생성
    const completion = await openai.createChatCompletion({
        model: "gpt-4o-2024-05-13",
        messages: messages,
        //max_tokens: 60,
    });


    // 생성된 응답 반환
    return completion.data.choices[0].message.content;
}


// API 요청 처리 함수 - generateWonyoungResponse가 생성해놓은 응답을 프론트에 전달
export default async function handler(req, res) {
    try {
        // 요청에서 질문, 대화 기록 가져오기
        const { question, conversationHistory } = req.body;
        //** 원영 응답 생성
        const response = await generateWonyoungResponse(question, conversationHistory);
        // 응답을 json 형태로 반환
        res.status(200).json({ response: response });
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: error.message });
    }
}
