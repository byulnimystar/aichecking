
export type AnswerType = 'checkbox' | 'yesno';

export interface ChecklistItem {
  id: string;
  text: string;
  lawReference?: string;
  type: AnswerType;
}

export interface Section {
  id: string;
  title: string;
  items: ChecklistItem[];
  description?: string;
}

export interface ChecklistState {
  [itemId: string]: boolean | null;
}

export interface EvaluationResult {
  summary: string;
  riskLevel: '낮음' | '보통' | '높음' | '매우 높음';
  recommendations: string[];
  complianceScore: number;
}
