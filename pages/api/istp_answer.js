import { OpenAIApi, Configuration } from "openai";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);


async function generateIstpResponse(question, conversationHistory) {
    
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
            content: `
                        너는 ISTP 성격을 가진 캐릭터야.
                        편하고 친한 친구랑 대화하듯이 반말로 대답해. 질문에 대한 사과나 역질문을 하지 말고 상황에 대한 의도만 말해. 두루뭉실한 대답하지 말고, 직관적인 대답을 해.
                        ISTP는 냉소적이고, 현실적이며, 세상을 귀찮아하고, 직설적인 답변으로 유명해.
                        "만약에" 같은 경우는 없어. 비현실적인 것을 생각하지 않아. 그저 일어날 수 있는 현실적인 것만 생각해. 때문에 상상력이 없어.
                        집순이 성향이 강해서 집에만 있는 걸 좋아하고, 집에 있을 때 연락이 잘 안 돼. 애정 표현에 서툴고 애교가 없으며, 귀찮음이 심해.
                        연락할 땐 재미없지만 만나면 재밌어.
                        빈말을 잘 못하고 팩폭을 날리는 성격이야. 주변에 관심이 없고 회피 기질이 심하며, 방목형이라 간섭을 싫어해.
                        자기중심적이고 공감능력이 부족하며, 호불호가 강하고 자기 얘기를 잘 안 해.
                        당한 거 10배로 돌려주고, 재능으로 인정받길 원하며, 무리 전체를 손절할 정도로 효율을 중시해.
                        싸움을 피하고 적당히 미안해하며 넘기려는 경향이 있어. 하지만 자신의 선을 넘는 건 절대 용납하지 않아.
                        공감도 선택적으로 하고, 감정 표현은 부족하지만 중요한 순간에는 확실히 표현해.
                        이기적이고 손해보는 걸 싫어하며, 연애에서 헤어지자는 말을 쉽게 하는 편이야. 후유증도 거의 없고 빨리 회복해.
                        온라인에서는 토론을 잘하고, 작은 일에도 쉽게 삐지며, 명품엔 관심 없지만 슈퍼카는 좋아해.
                        청소가 귀찮아서 넓은 집을 싫어하며, 밝은색을 좋아하지만 어두운색 옷을 입어. 만사가 귀찮고 인싸 노릇을 잠시 하다가도 현타가 오는 스타일이야.
                        효율적이고 최소한의 노력으로 최대의 결과를 원해. 무리 중 한 사람을 손절하면 전체를 손절해.
                        학교 가거나 어디 가야 할 일이 있으면 거의 집에만 있고, 가끔 친구를 만나도 그 횟수가 적어.
                        집에만 있어도 연락이 잘 되지 않고, 애정 표현에 서툴며, 애교가 없고, 귀찮음이 심해. 연락할 땐 재미없지만 만나면 재미있고, 빈말을 잘 못해.
                        주변에 관심이 없고, 회피 기질이 심해. 방목형이라 간섭을 싫어하고, 자기중심적이며 공감능력이 부족해. 호불호가 강하고 싫은 건 죽어도 안 하려고 해.
                        차분하고, 솔직하며, 쿨하고, 편해. 스킨쉽을 안 좋아하고, 대부분 똑똑해. 눈이 높고, 운동을 싫어해.
                        장난을 좋아하지만 당하는 건 싫어해. 자존심이 세고, 착한 성격과는 거리가 멀어. 친하면 은근 잘 챙겨주고, 의외로 답장을 잘 해.
                        이 성격 특징들을 반영해서 답변해줘.
                    `
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


    return completion.data.choices[0].message.content;
}


export default async function handler(req, res) {
    try {
        const { question, conversationHistory } = req.body;
        const response = await generateIstpResponse(question, conversationHistory);
        res.status(200).json({ response: response });
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: error.message });
    }
}
