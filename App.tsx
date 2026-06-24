
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCheck, 
  Info, 
  AlertTriangle, 
  Lightbulb, 
  Building, 
  Check, 
  Loader2, 
  Bot,
  RefreshCcw,
  ShieldCheck
} from 'lucide-react';
import { CHECKLIST_DATA } from './constants';
import { ChecklistState, EvaluationResult } from './types';
import { getAIFeedback } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<ChecklistState>({});
  const [orgContext, setOrgContext] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize state
  useEffect(() => {
    const initialState: ChecklistState = {};
    CHECKLIST_DATA.forEach(section => {
      section.items.forEach(item => {
        initialState[item.id] = null;
      });
    });
    setState(initialState);
  }, []);

  const handleToggle = (id: string, value: boolean | null) => {
    setState(prev => ({ ...prev, [id]: value }));
  };

  const remainingCount = useMemo(() => {
    const total = CHECKLIST_DATA.reduce((acc, s) => acc + s.items.length, 0);
    const answered = Object.values(state).filter(v => v !== null).length;
    return total - answered;
  }, [state]);

  const progress = useMemo(() => {
    const total = CHECKLIST_DATA.reduce((acc, s) => acc + s.items.length, 0);
    const answered = Object.values(state).filter(v => v !== null).length;
    return Math.round((answered / total) * 100);
  }, [state]);

  const isHighImpact = useMemo(() => {
    const highImpactItems = CHECKLIST_DATA.find(s => s.id === 'high-impact')?.items || [];
    return highImpactItems.some(item => state[item.id] === true);
  }, [state]);

  const handleSubmit = async () => {
    if (remainingCount > 0) {
      alert(`아직 응답하지 않은 항목이 ${remainingCount}개 있습니다. 모든 항목을 체크해주세요.`);
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await getAIFeedback(CHECKLIST_DATA, state, orgContext);
      setEvaluation(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    const initialState: ChecklistState = {};
    CHECKLIST_DATA.forEach(section => {
      section.items.forEach(item => {
        initialState[item.id] = null;
      });
    });
    setState(initialState);
    setEvaluation(null);
    setOrgContext('');
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-indigo-900 text-white py-8 px-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ClipboardCheck className="text-indigo-300" size={28} />
              기관용 AI 활용 적정성 체크리스트
            </h1>
            <p className="text-indigo-200 text-sm mt-1 font-medium">인공지능기본법 기반 실무 가이드라인</p>
          </div>
          <div className="w-full md:w-48 bg-indigo-800 rounded-full h-4 relative overflow-hidden">
            <div 
              className="bg-green-400 h-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
              진행률 {progress}%
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        <AnimatePresence mode="wait">
        {evaluation ? (
          <motion.div 
            key="evaluation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden border border-indigo-100"
          >
            <div className={`p-6 text-white ${
              evaluation.riskLevel === '높음' || evaluation.riskLevel === '매우 높음' ? 'bg-red-600' : 
              evaluation.riskLevel === '보통' ? 'bg-orange-500' : 'bg-green-600'
            }`}>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <ShieldCheck size={28} />
                  진단 결과: {evaluation.riskLevel} 위험
                </h2>
                <div className="text-4xl font-bold">{evaluation.complianceScore}<span className="text-lg">점</span></div>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Info className="text-indigo-500" size={20} />
                  종합 요약
                </h3>
                <p className="text-gray-600 leading-relaxed bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
                  {evaluation.summary}
                </p>
              </section>

              {isHighImpact && (
                <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg flex gap-4 items-start">
                  <AlertTriangle className="text-red-500 mt-1 shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-red-700">주의: 고영향 인공지능(High-impact AI) 해당</h4>
                    <p className="text-sm text-red-600 mt-1">
                      본 업무는 인공지능기본법 제2조제4호에 따른 고영향 AI에 해당할 가능성이 큽니다. 
                      "자동 결정 금지 / 참고·보조 도구 활용" 원칙을 반드시 준수하십시오.
                    </p>
                  </div>
                </div>
              )}

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Lightbulb className="text-yellow-500" size={20} />
                  AI 권고 사항
                </h3>
                <ul className="space-y-3">
                  {evaluation.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-3 bg-gray-50 p-3 rounded-md border border-gray-100">
                      <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">{i+1}</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="pt-6 border-t border-gray-100 flex justify-center">
                <button 
                  onClick={resetForm}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-md"
                >
                  <RefreshCcw size={20} />
                  새로운 진단 시작하기
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="checklist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Org Context Input */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-50">
              <h2 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <Building size={20} />
                기관 및 업무 정보
              </h2>
              <textarea 
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="예: OO교육청 교육행정팀, 생성형 AI를 활용한 보도자료 초안 작성 업무"
                rows={3}
                value={orgContext}
                onChange={(e) => setOrgContext(e.target.value)}
              ></textarea>
              <p className="text-xs text-gray-400 mt-2">사용 중인 AI 모델명이나 구체적인 업무 맥락을 적어주시면 더 정확한 피드백이 가능합니다.</p>
            </div>

            {/* Checklist Sections */}
            {CHECKLIST_DATA.map((section) => (
              <section key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-indigo-900 text-lg">{section.title}</h2>
                  {section.description && <p className="text-sm text-red-500 mt-1 font-medium">{section.description}</p>}
                </div>
                <div className="divide-y divide-gray-50">
                  {section.items.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-6 transition-colors ${
                        state[item.id] === null 
                        ? 'bg-amber-50/30 hover:bg-amber-50/50' 
                        : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-gray-800 font-medium">{item.text}</p>
                            {state[item.id] === null && (
                              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold animate-pulse">응답 필요</span>
                            )}
                          </div>
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-500 text-[10px] rounded font-bold">
                            근거: 인공지능기본법 {item.lawReference}
                          </span>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {item.type === 'checkbox' ? (
                            <button 
                              onClick={() => handleToggle(item.id, state[item.id] === true ? false : true)}
                              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition ${
                                state[item.id] === true 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : state[item.id] === false
                                ? 'bg-white border-gray-300 text-gray-300'
                                : 'border-amber-300 bg-white text-transparent hover:border-indigo-300'
                              }`}
                            >
                              <Check size={24} className={state[item.id] === true ? 'opacity-100' : 'opacity-20'} />
                            </button>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleToggle(item.id, true)}
                                className={`px-4 py-2 rounded-lg border-2 font-bold transition ${
                                  state[item.id] === true 
                                  ? 'bg-red-500 border-red-500 text-white' 
                                  : 'border-gray-200 text-gray-500 hover:border-red-300'
                                }`}
                              >
                                예
                              </button>
                              <button 
                                onClick={() => handleToggle(item.id, false)}
                                className={`px-4 py-2 rounded-lg border-2 font-bold transition ${
                                  state[item.id] === false 
                                  ? 'bg-blue-500 border-blue-500 text-white' 
                                  : 'border-gray-200 text-gray-500 hover:border-blue-300'
                                }`}
                              >
                                아니오
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-4 pb-12">
              {remainingCount > 0 && (
                <p className="text-amber-600 font-bold text-sm flex items-center gap-1">
                  <Info size={14} />
                  아직 응답하지 않은 항목이 {remainingCount}개 있습니다.
                </p>
              )}
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || remainingCount > 0}
                className={`group relative px-12 py-4 rounded-xl font-bold text-white text-lg shadow-xl transition-all ${
                  isSubmitting || remainingCount > 0 
                  ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    AI 분석 중...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Bot size={24} />
                    {remainingCount > 0 ? `진단 진행 중 (${progress}%)` : "진단 결과 확인 및 AI 피드백 받기"}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* Floating Info */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-4 z-20 md:hidden flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
             <div className="h-full bg-green-500" style={{ width: `${progress}%` }}></div>
           </div>
           <span className="text-xs font-bold text-gray-500">{progress}%</span>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={progress < 100}
          className={`px-4 py-2 rounded-lg text-sm font-bold text-white ${progress < 100 ? 'bg-gray-300' : 'bg-indigo-600'}`}
        >
          결과보기
        </button>
      </footer>
    </div>
  );
};

export default App;
