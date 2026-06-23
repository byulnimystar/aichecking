
import { GoogleGenAI, Type } from "@google/genai";
import { ChecklistState, Section } from "../types";

const API_KEY = process.env.API_KEY || "";

export const getAIFeedback = async (
  sections: Section[],
  state: ChecklistState,
  orgContext: string
) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Construct a summary of the checklist for the AI
  const checklistSummary = sections.map(s => {
    const itemsSummary = s.items.map(i => {
      const val = state[i.id];
      const status = i.type === 'yesno' 
        ? (val === true ? '예(위험)' : val === false ? '아니오' : '미응답')
        : (val === true ? '완료' : '미완료');
      return `- ${i.text} (${i.lawReference}): ${status}`;
    }).join('\n');
    return `### ${s.title}\n${itemsSummary}`;
  }).join('\n\n');

  const prompt = `
당신은 대한민국 '인공지능기본법' 및 공공기관 AI 가이이드라인을 숙지한 AI 컴플라이언스 전문가입니다.
다음은 한 공공기관 사용자가 제출한 AI 활용 적정성 체크리스트 결과입니다.

[기관 및 업무 맥락]
${orgContext}

[체크리스트 결과]
${checklistSummary}

위 결과를 분석하여 다음 형식의 JSON 응답을 생성해주세요:
1. summary: 전체적인 AI 도입 적정성에 대한 요약 (2-3문장)
2. riskLevel: '낮음', '보통', '높음', '매우 높음' 중 하나
3. recommendations: 법적/윤리적 관점에서 개선해야 할 구체적인 권고 사항 (최소 3개)
4. complianceScore: 0~100 사이의 점수

반드시 유효한 JSON 형식으로만 답변하세요.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            riskLevel: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            complianceScore: { type: Type.NUMBER }
          },
          required: ["summary", "riskLevel", "recommendations", "complianceScore"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("AI Feedback Error:", error);
    throw error;
  }
};
