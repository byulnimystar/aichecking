
import { ChecklistState, Section, EvaluationResult } from "../types";

// 각 항목별 미준수(false) 시 제공할 맞춤형 권고 사항 데이터
const RECOMMENDATION_MAP: Record<string, string> = {
  'rm-1': '도입 전 인권 및 안전에 미치는 영향을 포함한 위험성 평가를 공식적으로 수행하십시오.',
  'rm-2': 'AI 운영 중 발생할 수 있는 사고에 대비한 비상 대응 매뉴얼과 책임 체계를 구축하십시오.',
  'ts-1': '사용자가 AI 서비스임을 명확히 인지할 수 있도록 화면에 안내 문구를 상시 게시하십시오.',
  'ts-2': 'AI의 처리 과정과 결과 도출 근거를 사용자가 요청 시 설명할 수 있는 체계를 마련하십시오.',
  'ho-1': 'AI의 결정을 최종 승인하거나 수정할 수 있는 공무원/담당자를 반드시 지정하십시오.',
  'ho-2': 'AI 오작동 시 즉시 가동을 중단하고 수동으로 전환할 수 있는 긴급 중단 버튼/절차를 마련하십시오.',
  'dp-1': '가명정보 처리 여부를 확인하고, 개인정보 영향평가를 실시하여 데이터 유출 위험을 차단하십시오.',
  'dp-2': '민감정보 수집 시 법적 근거를 재검토하고 최소 수집 원칙을 준수하는지 점검하십시오.',
  'hi-1': '보건/의료 등 고영향 영역은 더 엄격한 관리 기준이 적용되므로 전문 보안 컨설팅을 권장합니다.',
  'hi-2': '채용/인사 등 민감한 결정은 AI의 의견을 보조적으로만 활용하고 최종 결정은 반드시 사람이 수행하십시오.'
};

export const getAIFeedback = async (
  sections: Section[],
  state: ChecklistState,
  orgContext: string
): Promise<EvaluationResult> => {
  // 시뮬레이션을 위한 지연 시간 (사용자 경험을 위해 1초 대기)
  await new Promise(resolve => setTimeout(resolve, 1000));

  let totalItems = 0;
  let passedItems = 0;
  const failedItemIds: string[] = [];
  let isHighImpactArea = false;

  sections.forEach(section => {
    section.items.forEach(item => {
      totalItems++;
      // 'yesno' 타입은 true가 위험이므로, false여야 통과(passed)로 처리
      // 'checkbox' 타입은 true여야 통과(passed)로 처리
      if (item.type === 'checkbox') {
        if (state[item.id] === true) passedItems++;
        else failedItemIds.push(item.id);
      } else if (item.type === 'yesno') {
        if (state[item.id] === false) passedItems++;
        else if (state[item.id] === true) failedItemIds.push(item.id);
      }
      
      // 고영향 영역 체크 (섹션 ID가 'high-impact'이거나 관련 항목이 true일 때)
      if (section.id === 'high-impact' && state[item.id] === true) {
        isHighImpactArea = true;
      }
    });
  });

  const complianceScore = Math.round((passedItems / totalItems) * 100);
  
  let riskLevel: '낮음' | '보통' | '높음' | '매우 높음' = '낮음';
  let summary = '';

  if (complianceScore >= 90) {
    riskLevel = '낮음';
    summary = `${orgContext ? `'${orgContext}' 업무는 ` : ''}전반적으로 인공지능기본법의 준수 사항을 매우 잘 지키고 있습니다. 현재의 투명하고 안전한 관리 체계를 유지하시기 바랍니다.`;
  } else if (complianceScore >= 70) {
    riskLevel = '보통';
    summary = `법적 요구사항의 상당 부분을 충족하고 있으나, 몇 가지 보완이 필요합니다. 특히 미흡한 항목에 대해 권고 사항을 확인하여 개선하십시오.`;
  } else if (complianceScore >= 50) {
    riskLevel = '높음';
    summary = `현재 AI 도입 체계에 리스크가 존재합니다. 가이드라인에 따른 위험 관리 시스템과 투명성 확보 절차를 강화해야 안정적인 운영이 가능합니다.`;
  } else {
    riskLevel = '매우 높음';
    summary = `현재 상태로 AI를 도입할 경우 법적, 윤리적 책임 문제가 발생할 우려가 큽니다. 권고 사항을 바탕으로 거버넌스를 전면 재검토하십시오.`;
  }

  // 고영향 영역일 경우 위험도 상향 조정
  if (isHighImpactArea && (riskLevel === '낮음' || riskLevel === '보통')) {
    riskLevel = '높음';
    summary = `고영향 AI 영역(채용, 보건 등)에 해당하므로, 일반적인 AI보다 훨씬 엄격한 인간의 감독과 투명성 확보가 필수적입니다.`;
  }

  // 추천 사항 생성
  const recommendations = failedItemIds
    .map(id => RECOMMENDATION_MAP[id])
    .filter(Boolean);

  if (recommendations.length === 0) {
    recommendations.push("현재의 우수한 관리 체계를 유지하며 정기적인 자체 감사를 수행하십시오.");
    recommendations.push("최신 인공지능 법규 및 지침 변화를 지속적으로 모니터링하십시오.");
  }

  return {
    summary,
    riskLevel,
    recommendations: recommendations.slice(0, 5), // 최대 5개 표시
    complianceScore
  };
};
