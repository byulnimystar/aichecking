
import { Section } from './types';

export const CHECKLIST_DATA: Section[] = [
  {
    id: 'basic',
    title: 'Ⅰ. 기본 확인 단계 (AI 사용 전)',
    items: [
      { id: 'b1', text: '이 업무에 AI를 사용하는 것이 업무 목적에 부합하는가', lawReference: '제1조', type: 'checkbox' },
      { id: 'b2', text: 'AI 사용이 국민·학생의 권익과 존엄성을 침해할 우려는 없는가', lawReference: '제1조', type: 'checkbox' },
      { id: 'b3', text: '해당 AI 활용이 법령 또는 내부 규정에 명시적으로 금지되어 있지 않은가', lawReference: '제5조', type: 'checkbox' },
      { id: 'b4', text: '국외 서비스라도 국내 이용자에게 영향을 미치는 경우임을 인식하고 있는가', lawReference: '제4조', type: 'checkbox' },
    ]
  },
  {
    id: 'high-impact',
    title: 'Ⅱ. 고영향 인공지능 해당 여부 점검 (핵심)',
    description: '위 질문 중 하나라도 “예”라면 고영향 인공지능으로 간주하여 신중히 사용해야 합니다.',
    items: [
      { id: 'h1', text: '이 AI 사용이 공공서비스 자격·비용·결정에 영향을 주는가?', lawReference: '제2조제4호 자', type: 'yesno' },
      { id: 'h2', text: '이 AI 사용이 학생 평가에 직접 또는 간접적으로 사용되는가?', lawReference: '제2조제4호 차', type: 'yesno' },
      { id: 'h3', text: '이 AI 사용이 개인의 권리·의무 판단에 영향을 주는가?', lawReference: '제2조제4호 사', type: 'yesno' },
    ]
  },
  {
    id: 'responsibility',
    title: 'Ⅲ. 기본원칙 및 책임 점검',
    items: [
      { id: 'r1', text: 'AI는 결정권자가 아니라 보조도구로만 사용했는가', lawReference: '제3조', type: 'checkbox' },
      { id: 'r2', text: '최종 판단과 책임이 사람에게 있음을 명확히 하고 있는가', lawReference: '제3조', type: 'checkbox' },
      { id: 'r3', text: 'AI 결과에 대해 설명할 수 있는 범위에서만 활용하고 있는가', lawReference: '제3조제2항', type: 'checkbox' },
      { id: 'r4', text: '영향받는 자(국민·학생)의 입장에서 설명 가능성을 고려했는가', lawReference: '제3조제2항', type: 'checkbox' },
    ]
  },
  {
    id: 'ethics',
    title: 'Ⅳ. 인공지능 윤리 점검',
    items: [
      { id: 'e1', text: 'AI 사용이 사람의 존엄성을 훼손하지 않는가', lawReference: '제27조', type: 'checkbox' },
      { id: 'e2', text: '안전성과 신뢰성을 해칠 우려는 없는가', lawReference: '제27조제1호', type: 'checkbox' },
      { id: 'e3', text: '특정 집단에 불리한 결과를 초래할 위험은 없는가', lawReference: '제27조', type: 'checkbox' },
      { id: 'e4', text: '윤리원칙에 반하는 사용이라는 사회적 오해 소지는 없는가', lawReference: '제27조', type: 'checkbox' },
    ]
  },
  {
    id: 'transparency',
    title: 'Ⅴ. 투명성·고지 점검 (특히 생성형 AI 사용 시)',
    items: [
      { id: 't1', text: '생성형 AI를 사용했음을 내부적으로 인지하고 있는가', lawReference: '제31조', type: 'checkbox' },
      { id: 't2', text: '외부 제공 문서·결과물에 AI 활용 사실을 표시 또는 고지할 필요가 있는가', lawReference: '제31조제1·2항', type: 'checkbox' },
      { id: 't3', text: 'AI 결과물을 사람이 작성한 것처럼 오인하게 만들지는 않는가', lawReference: '제31조', type: 'checkbox' },
    ]
  },
  {
    id: 'safety',
    title: 'Ⅵ. 안전성·위험 관리 인식 점검',
    items: [
      { id: 's1', text: '해당 AI가 고영향 인공지능인지 사전에 검토했는가', lawReference: '제33조', type: 'checkbox' },
      { id: 's2', text: '위험 발생 시 사용 중단 또는 수정이 가능한가', lawReference: '제29조', type: 'checkbox' },
      { id: 's3', text: 'AI 사용으로 인한 문제 발생 시 책임 주체가 명확한가', lawReference: '제3조, 제34조', type: 'checkbox' },
    ]
  }
];
