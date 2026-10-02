import React from 'react';
import { Activity, ShieldAlert, TrendingUp, Cpu, Award, Zap, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function PerformanceDashboard() {
  const featureImportances = [
    { name: '단위면적당가격_만원m2', importance: 92, color: 'bg-indigo-500' },
    { name: '건물나이', importance: 78, color: 'bg-emerald-500' },
    { name: '자치구명', importance: 64, color: 'bg-amber-500' },
    { name: '건물면적_m2', importance: 42, color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 relative overflow-hidden transition-all hover:bg-white/10 shadow-xl group">
          <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-white/10 transition-colors">
            <Award className="w-12 h-12" />
          </div>
          <span className="text-xs text-slate-400 font-mono tracking-wider block mb-1 font-bold">분류 모델</span>
          <h4 className="text-sm font-semibold text-slate-200">판정 정확도</h4>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-400">87.4%</span>
            <span className="text-xs text-emerald-400 font-medium font-mono">+1.2% v DT</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-sans">
            서울 아파트 실거래 4클래스 다중 레이블 분류 정합도
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 relative overflow-hidden transition-all hover:bg-white/10 shadow-xl group">
          <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-white/10 transition-colors">
            <TrendingUp className="w-12 h-12" />
          </div>
          <span className="text-xs text-slate-400 font-mono tracking-wider block mb-1 font-bold">분류 신뢰도</span>
          <h4 className="text-sm font-semibold text-slate-200">등급 신뢰도</h4>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400">85.3%</span>
            <span className="text-xs text-emerald-400 font-medium font-mono">F1-Score: 0.849</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-sans">
            투자 최적 모델 예측시 위포지션 탐지 오차율 이하 유지
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 relative overflow-hidden transition-all hover:bg-white/10 shadow-xl group">
          <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-white/10 transition-colors">
            <Activity className="w-12 h-12" />
          </div>
          <span className="text-xs text-slate-400 font-mono tracking-wider block mb-1 font-bold">회귀 분석</span>
          <h4 className="text-sm font-semibold text-slate-200">평균 예측 오차</h4>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-400">±820 만원</span>
            <span className="text-xs text-slate-400 font-mono">중앙값 대비 0.96%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-sans">
            실 가격 대비 오차 징후 보정 완료
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 relative overflow-hidden transition-all hover:bg-white/10 shadow-xl group">
          <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-white/10 transition-colors">
            <Cpu className="w-12 h-12" />
          </div>
          <span className="text-xs text-slate-400 font-mono tracking-wider block mb-1 font-bold">적중률</span>
          <h4 className="text-sm font-semibold text-slate-200">예측 적중률</h4>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-400">0.891</span>
            <span className="text-xs text-blue-400 font-medium font-mono">평단가 대비</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-sans">
            실거래 데이터 20,666건에 대한 설명 능력 계량 수치
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Importance Charts */}
        <div className="lg:col-span-3 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white font-sans">머신러닝 변수 중요도</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">Random Forest 앙상블 가중치 분석 결과</p>
            </div>
            <Zap className="text-amber-400 w-5 h-5 shrink-0" />
          </div>

          <div className="space-y-5">
            {featureImportances.map((feat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">{feat.name}</span>
                  <span className="text-blue-400 font-mono font-bold">{feat.importance}%</span>
                </div>
                <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    className={`h-full rounded-full ${feat.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${feat.importance}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-black/30 p-4 rounded-xl border border-white/10 text-[11px] text-slate-300 leading-relaxed space-y-1 font-sans">
            <p className="text-slate-250 font-semibold mb-1">■ 주요 피처 전처리 가중 지침:</p>
            <p>1. <strong>단위면적당가격</strong>: 아파트 매매 합계와 면적 비율을 파생 설계하여 예측 다변량 변수 1순위 적용.</p>
            <p>2. <strong>건물나이</strong>: 서울 아파트 시세에 강력한 인자를 미치는 감가상각 가중 지형 보정.</p>
            <p>3. <strong>자치구명</strong>: 자치구별 가중 팩터 노원 0.75 등이 원-핫 인코딩으로 학습 연동.</p>
          </div>
        </div>

        {/* Right Info Board */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-400 inline-block" />
              RealScore Pro 모델 학습 하이퍼파라메터
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              서울시 부동산 실거래가 20,666건의 이상치를 완결 제거하고, 정규화를 필두로 정합성을 조율한 <strong>최종 배포형 파이프라인</strong> 세부 사양입니다.
            </p>

            <div className="border-t border-white/10 pt-3 space-y-3 text-xs font-sans">
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">최종 모델 분류</span>
                <span className="text-blue-400 font-semibold font-mono">Random Forest Classifier</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">인수 사양</span>
                <span className="text-white font-mono">200 Estimators</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">최대 깊이</span>
                <span className="text-white font-mono">10 Nodes Leaf</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">최종 모델 회귀</span>
                <span className="text-emerald-400 font-semibold font-mono">Random Forest Regressor</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">데이터 전처리 규격</span>
                <span className="text-amber-400 font-mono">StandardScaler + One-Hot</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 bg-black/40 p-3 rounded-xl flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
            <div className="text-[10px] font-sans">
              <span className="text-slate-300 font-bold block">Engine State: ACTIVE INFERENCE</span>
              <span className="text-slate-500 font-mono">실시간 추론 API 가동 완료</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
