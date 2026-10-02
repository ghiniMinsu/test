import React, { useState, useEffect } from 'react';
import {
  Sparkles, BarChart2, Table, FileText, Code, CheckCircle, AlertTriangle, Play,
  RefreshCw, ChevronRight, Copy, Download, Search, MapPin, Building,
  ArrowUpRight, TrendingUp, Layers, HelpCircle, Activity, ExternalLink,
  Users, Server, Database, MessageSquare, Ticket, FileSpreadsheet, PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data imports
import { RAW_RECORDS, DISTRICT_BASELINES, INITIAL_QUERY_HISTORY, predictRealScore } from './mockData';
import { MergedRecord, QueryHistory } from './types';

// Component imports
import ReviewReport from './components/ReviewReport';
import PerformanceDashboard from './components/PerformanceDashboard';
import { compileOfflineMockupHTML } from './components/OfflineMockupCompiler';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'inference' | 'ledger' | 'metrics' | 'report' | 'export'>('report');
  const [customerSubTab, setCustomerSubTab] = useState<'predictor' | 'report'>('predictor');
  const analysisIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Actor role perspective (Slide 6)
  const [activeRole, setActiveRole] = useState<'customer' | 'operator' | 'admin' | 'ai_engine'>('customer');

  // Input states for AI predictor
  const [selectedDistrict, setSelectedDistrict] = useState<string>('강남구');
  const [customAptName, setCustomAptName] = useState<string>('압구정 골든 시티');
  const [selectedArea, setSelectedArea] = useState<number>(84);
  const [selectedFloor, setSelectedFloor] = useState<number>(15);
  const [selectedBuildYear, setSelectedBuildYear] = useState<number>(2015);
  
  // Calculations (real-time derived variables, Slide 3) with safe typings & fallbacks
  const safeBuildYear = Number(selectedBuildYear) || 2015;
  const buildingAge = 2026 - safeBuildYear;
  const safeDistrict = selectedDistrict || '강남구';
  const safeFloor = Number(selectedFloor) || 15;
  const unitPriceEstimate = Math.round((DISTRICT_BASELINES[safeDistrict]?.pricePerM2 || 1000) * (safeFloor >= 11 ? 1.05 : 1.0));

  // Prediction output
  const [predictionResult, setPredictionResult] = useState<any>(null);
  
  // Simulating the 12-Stage sequence diagram (Slide 10)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const [intentionalError, setIntentionalError] = useState<boolean>(false);
  
  // Ledger states
  const [ledgerSearch, setLedgerSearch] = useState<string>('');
  const [ledgerDistrictFilter, setLedgerDistrictFilter] = useState<string>('ALL');
  const [ledgerGradeFilter, setLedgerGradeFilter] = useState<string>('ALL');
  const [selectedLedgerRow, setSelectedLedgerRow] = useState<MergedRecord | null>(RAW_RECORDS[0]);

  // Query History state (Slide 8, logs queries)
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>(INITIAL_QUERY_HISTORY);

  // Operator Actions & State (Slide 6)
  const [couponsIssued, setCouponsIssued] = useState<number>(3);
  const [systemAlertMessage, setSystemAlertMessage] = useState<string | null>(null);
  const [showToasts, setShowToasts] = useState<Array<{ id: number; text: string; type: 'success' | 'error' | 'info' }>>([]);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setShowToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setShowToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Run initial prediction
  useEffect(() => {
    const defaultPred = predictRealScore('강남구', 84, 15, 2015);
    setPredictionResult(defaultPred);
  }, []);

  // Guarantee interval cleanup on unmount
  useEffect(() => {
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, []);

  // Prepopulate form if a row in raw ledger is clicked
  const handleLoadRowIntoForm = (row: MergedRecord) => {
    setSelectedDistrict(row.district);
    setCustomAptName(row.apt_name);
    setSelectedArea(row.area_m2);
    setSelectedFloor(row.floor);
    // Find correct build year
    const foundYear = row.build_year;
    setSelectedBuildYear(foundYear);
    addToast(`"${row.apt_name}" 레코드를 조율 폼에 안전하게 이전 완료!`, 'info');
    setActiveRole('customer');
    setCustomerSubTab('predictor');
    setActiveTab('inference');
  };

  // 12-Step pipeline machine simulation (Slide 10)
  const handleStartAnalysis = () => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    setAnalysisStep(1);
    setAnalysisLogs([]);
    
    const steps = [
      { id: 1, text: '🔄 [1] 부동산 상세 정보 (자치구, 면적, 층, 연식) API 서버 제출' },
      { id: 2, text: '🔄 [2] 원시 실거래 파편 데이터 전달 (Vite Proxy → FastAPI)' },
      { id: 3, text: '🔄 [3] 파생 공학 모듈 탑재: 건물나이(Age) 및 단위면적당가격 실시간 연산' },
      { id: 4, text: '🔄 [4] 정제 가중 피처 StandardScaler 파이프라인 정규 표준화 완료' },
      { id: 5, text: '🔄 [5] [par] Random Forest 투자등급 분류 모델 병렬 가중치 산정 요청' },
      { id: 6, text: '🔄 [6] [par] 분류 성능 수합 가이드: 투자등급 A/B/C/D 완결 판정' },
      { id: 7, text: '🔄 [7] [par] Random Forest Regressor 예상 매매가격(만원) 병렬 회귀 분석' },
      { id: 8, text: '🔄 [8] [par] 시세 최종 수렴 예측치 반화 완료' },
      { id: 9, text: '🔄 [9] 최종 분석 통합 결과 예측 이력 DB(Result DB)에 보전 영속화' },
      { id: 10, text: '🔄 [10] Result DB 무결성 가중 확인 저장 응답 수신 완료' },
      { id: 11, text: '🔄 [11] RealScore Pro 통합 대시보드 뷰 렌더링 피드 바인딩' }
    ];

    let current = 0;
    
    analysisIntervalRef.current = setInterval(() => {
      if (intentionalError && current === 3) {
        // Alt branch exception simulation
        if (analysisIntervalRef.current) {
          clearInterval(analysisIntervalRef.current);
        }
        setAnalysisLogs(prev => [
          ...prev,
          '❌ [12] [예외 반기 분산] 주택 주소지 이상 데이터 감지 및 가용 자치구 범위 초과 오류!',
          '⚠️ API 피드백 중단: Exception 400 Bad Request Returned.'
        ]);
        setIsAnalyzing(false);
        addToast('주소 예외 감지! 시퀀스가 예외 오류(alt 분기)로 탈선되었습니다.', 'error');
        return;
      }

      if (current < steps.length) {
        const step = steps[current];
        if (step) {
          setAnalysisLogs(prev => [...prev, String(step.text || '') + '... 성공']);
          setAnalysisStep(Math.min(11, current + 2));
        }
        current++;
      } else {
        if (analysisIntervalRef.current) {
          clearInterval(analysisIntervalRef.current);
        }
        setIsAnalyzing(false);
        
        try {
          const safeDist = selectedDistrict || '강남구';
          const safeArea = Number(selectedArea) || 84;
          const safeF = Number(selectedFloor) || 15;
          const safeYear = Number(selectedBuildYear) || 2015;

          // Execute math with parsed safe inputs
          const results = predictRealScore(safeDist, safeArea, safeF, safeYear);
          setPredictionResult(results);

          // Record history query (Slide 8)
          const newHist: QueryHistory = {
            hist_id: Date.now(),
            user_email: 'scv12365@gmail.com',
            apt_name: (customAptName || '알 수 없는 아파트').trim(),
            district: safeDist,
            area_m2: safeArea,
            floor: safeF,
            query_time: new Date().toISOString(),
            query_type: activeRole === 'customer' ? '프리미엄조회' : '일반조회',
            predicted_grade: results ? results.grade : 'C',
            predicted_price_ten_thousand: results ? results.predictedPrice : 85000
          };
          
          setQueryHistory(prev => [newHist, ...prev]);
          addToast('AI 모델 통합 연산 성공! 실거래 근거 등급 판정이 완료되었습니다.', 'success');
        } catch (error) {
          console.error("AI Analysis Integration error:", error);
          addToast('AI 모델 조율 연산 중 오류가 발생하여 기본 추론 결과로 우회합니다.', 'error');
          const fallbackResults = predictRealScore('강남구', 84, 15, 2015);
          setPredictionResult(fallbackResults);
        }
      }
    }, 120);
  };

  // Action simulations for Role players
  const handleIssueCoupon = () => {
    setCouponsIssued(prev => prev + 1);
    addToast('스토어 운영자 전용: 타겟 사용자 마케팅 특별 10% 프리미엄 할인 쿠폰 발급 완료!', 'success');
  };

  const handleClearHistory = () => {
    setQueryHistory([]);
    addToast('관리자 특권: 시스템 조회 로그 데이터베이스가 깔끔하게 플러시되었습니다.', 'info');
  };

  const handleRetrainModel = () => {
    addToast('AI 분석 엔진: 서울시 20,666건 데이터 재정전환 정규화 점검 중...', 'info');
    setTimeout(() => {
      addToast('모델 재학습 완료! 정확도가 87.4% 에서 87.8% 로 보정 수렴되었습니다.', 'success');
    }, 1500);
  };

  // Compile offline client download helper (Standard Blob download tool matching commands)
  const handleDownloadOfflineMockup = () => {
    const htmlString = compileOfflineMockupHTML();
    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'RealScore_Pro_Offline_Mockup_v2.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('단일 완결형 오차 없는 Offline Mockup HTML 파일 추출 성공!', 'success');
  };

  // PostgreSQL DDL code string to copy
  const ddlScript = `-- RealScore Pro PostgreSQL DDL Script
-- 1. 사용자 (User) 테이블
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    membership_level VARCHAR(50) NOT NULL DEFAULT '일반'
);

-- 2. 아파트 (Apartment) 테이블
CREATE TABLE apartments (
    apt_id SERIAL PRIMARY KEY,
    district_name VARCHAR(100) NOT NULL, -- 자치구명
    dong_name VARCHAR(100) NOT NULL, -- 법정동명
    apt_name VARCHAR(255) NOT NULL, -- 건물명
    area_m2 DOUBLE PRECISION NOT NULL, -- 건물면적_m2
    floor_num INTEGER NOT NULL, -- 층
    build_year INTEGER NOT NULL -- 건축년도
);

-- 3. 실거래 (Real Transaction) 테이블
CREATE TABLE transactions (
    deal_id SERIAL PRIMARY KEY,
    apt_id INTEGER REFERENCES apartments(apt_id) ON DELETE CASCADE,
    price_ten_thousand INTEGER NOT NULL, -- 매매가_만원
    deal_date DATE NOT NULL, -- 계약일
    report_type VARCHAR(100) NOT NULL -- 신고구분
);

-- 4. 파생변수 (Derived Feature) 테이블 (1:1 관계)
CREATE TABLE derived_features (
    feat_id SERIAL PRIMARY KEY,
    apt_id INTEGER UNIQUE REFERENCES apartments(apt_id) ON DELETE CASCADE,
    building_age INTEGER NOT NULL, -- 건물나이 (2026 - 건축년도)
    price_per_m2 DOUBLE PRECISION NOT NULL, -- 단위면적당가격_만원m2
    subway_grade VARCHAR(20) NOT NULL -- 역세권등급 (우수/보통/불량)
);

-- 5. 조회이력 (Query History) 테이블
CREATE TABLE query_histories (
    hist_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    apt_id INTEGER REFERENCES apartments(apt_id) ON DELETE SET NULL,
    query_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    query_type VARCHAR(100) NOT NULL -- 조회유형
);

-- 인덱스 설정 (조회 시 구조 속도 향상용)
CREATE INDEX idx_apartments_district ON apartments(district_name);
CREATE INDEX idx_transactions_deal_date ON transactions(deal_date);
CREATE INDEX idx_query_histories_user ON query_histories(user_id);`;

  const handleCopyDDL = () => {
    navigator.clipboard.writeText(ddlScript);
    addToast('PostgreSQL 데이터베이스 테이블 설계 DDL 클립보드 복사 완료!', 'success');
  };

  // Filter raw records
  const filteredRecords = RAW_RECORDS.filter(rec => {
    const matchesSearch = rec.apt_name.toLowerCase().includes(ledgerSearch.toLowerCase()) || 
                          rec.dong.toLowerCase().includes(ledgerSearch.toLowerCase());
    const matchesDistrict = ledgerDistrictFilter === 'ALL' || rec.district === ledgerDistrictFilter;
    const matchesGrade = ledgerGradeFilter === 'ALL' || rec.grade === ledgerGradeFilter;
    return matchesSearch && matchesDistrict && matchesGrade;
  });

  return (
    <div id="realscore-app" className="min-h-screen bg-[#0c0e14] text-slate-200 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Dynamic Frosted Glass Background glowing circles (Slide 2 Theme) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Dynamic Toast Alert Notifications */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {showToasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className={`p-4 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-3 pointer-events-auto backdrop-blur-md ${
                toast.type === 'success' ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300' :
                toast.type === 'error' ? 'bg-rose-950/80 border-rose-800 text-rose-300' :
                'bg-blue-950/80 border-blue-900 text-blue-300'
              }`}
            >
              <div className="shrink-0">
                {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                {toast.type === 'info' && <Activity className="w-4 h-4 text-indigo-400" />}
              </div>
              <p className="flex-1 font-medium leading-relaxed">{toast.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Application Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4 sticky top-0 z-40 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-lg shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-extrabold text-white tracking-widest hidden sm:inline-block font-mono bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
              REAL-SCORE <span className="text-blue-400 font-bold">PRO</span>
            </span>
            <div className="inline-flex bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-medium backdrop-blur-md">
              {[
                { id: 'customer', label: '고객', icon: Users, tab: 'inference' },
                { id: 'operator', label: '운영자', icon: Ticket, tab: 'ledger' },
                { id: 'admin', label: '관리자', icon: Server, tab: 'export' },
                { id: 'ai_engine', label: 'AI 엔진', icon: Activity, tab: 'metrics' },
              ].map(role => (
                <button
                  key={role.id}
                  id={`role-btn-${role.id}`}
                  onClick={() => {
                    const r = role.id as 'customer' | 'operator' | 'admin' | 'ai_engine';
                    setActiveRole(r);
                    setActiveTab(role.tab as any);
                    if (r === 'customer') {
                      setCustomerSubTab('predictor');
                    }
                    addToast(`가상 역할 [${role.label}] 전용 워크스페이스로 이주했습니다.`, 'info');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeRole === role.id
                      ? 'bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <role.icon className="w-3 h-3 shrink-0" />
                  <span>{role.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 relative z-10">

        {/* Dynamic Role-Based Status Header */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl relative overflow-hidden">
          {/* Subtle glowing role indicator behind */}
          {activeRole === 'customer' && <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl" />}
          {activeRole === 'operator' && <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600/10 rounded-full blur-2xl" />}
          {activeRole === 'admin' && <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl" />}
          {activeRole === 'ai_engine' && <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl" />}

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-full animate-pulse ${
                  activeRole === 'customer' ? 'bg-purple-500' :
                  activeRole === 'operator' ? 'bg-teal-500' :
                  activeRole === 'admin' ? 'bg-blue-500' :
                  'bg-amber-400'
                }`} />
                <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${
                  activeRole === 'customer' ? 'text-purple-400' :
                  activeRole === 'operator' ? 'text-teal-400' :
                  activeRole === 'admin' ? 'text-blue-400' :
                  'text-amber-400'
                }`}>
                  {activeRole === 'customer' && 'CUSTOMER PERSPECTIVE PORTAL'}
                  {activeRole === 'operator' && 'OPERATIONAL CONTROL DESK'}
                  {activeRole === 'admin' && 'SYSTEM SECURITY & CONTROL HEADQUARTERS'}
                  {activeRole === 'ai_engine' && 'RANDOM FOREST ML REGISTRIES'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                {activeRole === 'customer' && '고객 전용 인공지능 투자 가액 조율기'}
                {activeRole === 'operator' && '운영자 지원 및 실거래 원천 데이터 대장'}
                {activeRole === 'admin' && '시스템 무결성 및 물리 스키마 배치실'}
                {activeRole === 'ai_engine' && '인공지능 가중치 피드백 트레이너'}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed max-w-2xl font-medium">
                {activeRole === 'customer' && '서울 실거래가 20,666건 데이터에 투영한 Random Forest 앙상블 등급 기계입니다. 타겟 아파트의 자산 평정과 기획 문서를 유연하게 관제하십시오.'}
                {activeRole === 'operator' && '원천 계약 이력 테이블을 정렬/검색하고, 마케팅 쿠폰 즉발 시스템 및 이상치 레코드를 중앙 수집하여 안정적으로 플랫폼 수익을 소통합니다.'}
                {activeRole === 'admin' && 'Slide 8을 100% 구체화한 PostgreSQL DDL 무결성을 보존하고, 비동기 API 구간 연동 실패 예외 모사를 수동 가동하여 분기 안전성을 확보합니다.'}
                {activeRole === 'ai_engine' && '기획 8대 항목인 RMSE, R-squared 분포 그래프를 시각화하고, scaler 인풋 분산 보정 모델 가중치를 독립적으로 가상 재학습 재합성합니다.'}
              </p>
            </div>

            {/* Quick action / status metrics badge in the header */}
            <div className="shrink-0 flex sm:flex-col items-start sm:items-end gap-1 font-mono text-[11px] text-slate-400 bg-black/40 px-4 py-3 rounded-xl border border-white/5 shadow-inner">
              <span className="text-[10px] text-slate-500 font-bold">WORKSPACE STATUS</span>
              <div className="flex items-center gap-1.5 font-bold text-white mt-0.5">
                <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-emerald-400">ACTIVE OVERSEE READY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step Stepper Progress & Top Control Navigation */}
        {activeRole === 'customer' && (
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 shadow-xl space-y-4">
            
            {/* Row 1: Elegant, non-clickable step-progress text indicators */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full py-1 scrollbar-none border-b border-white/5 pb-3.5">
              {[
                { id: 'report', label: '1. 기획 검토서', desc: 'Spec Review' },
                { id: 'ledger', label: '2. 거래 데이터', desc: 'Raw Ledger' },
                { id: 'inference', label: '3. AI 예측 조율기', desc: 'Predictor' },
                { id: 'metrics', label: '4. ML 성능 분석', desc: 'Engine Metrics' },
                { id: 'export', label: '5. 파일 덤프', desc: 'Source Export' },
              ].map((step, idx) => {
                const isCurrent = activeTab === step.id;
                const isPast = ['report', 'ledger', 'inference', 'metrics', 'export'].indexOf(activeTab) > idx;

                return (
                  <React.Fragment key={step.id}>
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all text-xs font-semibold shrink-0 select-none text-left ${
                        isCurrent
                          ? 'bg-blue-600/20 border border-blue-500/50 text-white shadow-[0_0_15px_rgba(37,99,235,0.15)] ring-1 ring-blue-500/20'
                          : isPast
                          ? 'text-emerald-400 font-medium'
                          : 'text-slate-500 font-normal'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isCurrent ? 'bg-blue-500 text-white font-extrabold shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                        isPast ? 'bg-emerald-500/20 text-emerald-400 font-extrabold' :
                        'bg-slate-800 text-slate-500'
                      }`}>
                        {isPast ? '✓' : idx + 1}
                      </div>
                      <div className="flex flex-col border-none">
                        <span className="block text-left font-bold text-[11px] leading-tight">{step.label}</span>
                        <span className="text-[9px] text-slate-500 font-mono tracking-wider">{step.desc}</span>
                      </div>
                    </div>
                    {idx < 4 && (
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isPast ? 'text-emerald-500/40' : 'text-slate-700'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Row 2: Unified Next/Prev Navigation controls under the stepper */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              
              <button
                type="button"
                disabled={activeTab === 'report'}
                onClick={() => {
                  if (activeTab === 'ledger') setActiveTab('report');
                  else if (activeTab === 'inference') setActiveTab('ledger');
                  else if (activeTab === 'metrics') setActiveTab('inference');
                  else if (activeTab === 'export') setActiveTab('metrics');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  addToast('이전 정보 검토 단계로 회송했습니다.', 'info');
                }}
                className={`w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'report'
                    ? 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed opacity-30 select-none'
                    : 'bg-white/5 border-white/10 text-slate-305 hover:text-white hover:bg-white/10'
                }`}
              >
                ← 이전 단계로
              </button>

              <div className="text-center font-mono text-[11px] font-semibold text-slate-400 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>기획 단계상태: </span>
                <strong className="text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                  {activeTab === 'report' && 'Step 1: 기획 설계 검토 보고서'}
                  {activeTab === 'ledger' && 'Step 2: 거래 원천대장 데이터'}
                  {activeTab === 'inference' && 'Step 3: Random Forest 실시간 정밀 조율기'}
                  {activeTab === 'metrics' && 'Step 4: 기계학습 평정 및 엔진 척도'}
                  {activeTab === 'export' && 'Step 5: DDL 아카이브 및 덤프 팩'}
                </strong>
              </div>

              {activeTab === 'export' ? (
                <div className="w-full sm:w-auto text-center">
                  <span className="flex items-center justify-center gap-1 text-[11px] text-emerald-400 font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl">
                    ✓ 모든 기획 단계 완성
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'report') {
                      setActiveTab('ledger');
                    } else if (activeTab === 'ledger') {
                      if (selectedLedgerRow) {
                        handleLoadRowIntoForm(selectedLedgerRow);
                      } else {
                        setActiveTab('inference');
                      }
                    } else if (activeTab === 'inference') {
                      setActiveTab('metrics');
                    } else if (activeTab === 'metrics') {
                      setActiveTab('export');
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <span>
                    {activeTab === 'ledger' && selectedLedgerRow
                      ? '선택한 원천 실거래 데이터로 AI 예측 이동구현 →'
                      : '다음 단계로 →'}
                  </span>
                </button>
              )}

            </div>

          </div>
        )}

        {/* Main Workspace Area */}
        <main id="main-workspace animate-fade-in" className="w-full space-y-6 min-h-0">
          
          {/* TAB 1: Real-time ML Estimator */}
          {activeRole === 'customer' && activeTab === 'inference' && (
            <div className="space-y-6">
              
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      Random Forest 기반 실시간 통합 판정기 (Inference Unit)
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">자산 전용면적, 층수, 자치구별 가중치 특징 정량 예측 시뮬레이터</p>
                  </div>
                  
                  {/* Option to toggle intentional error flow for Slide 10 Sequential Diagram */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                      인적 오류 분기 테스트 (alt 모사):
                    </label>
                    <button
                      onClick={() => {
                        setIntentionalError(!intentionalError);
                        addToast(`의도적 주소 예외 분기가 ${!intentionalError ? '활성화' : '비활성화'}되었습니다.`, 'info');
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                        intentionalError
                          ? 'bg-rose-500/20 border-rose-500/30 text-rose-300 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {intentionalError ? '활성 (Error 400 모사)' : '비활성 (Normal)'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                  
                  {/* Form inputs */}
                  <form onSubmit={e => { e.preventDefault(); handleStartAnalysis(); }} className="md:col-span-6 space-y-4">
                    
                    {/* Apartment custom name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-350 mb-1.5">대상 건물명 (가설)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={customAptName}
                          onChange={e => setCustomAptName(e.target.value)}
                          className="w-full bg-black/40 focus:ring-2 focus:ring-blue-550 focus:border-blue-500 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 backdrop-blur-md transition-all"
                          placeholder="예: 압구정 팰리스"
                        />
                        <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-350 mb-1.5">행정 자치구</label>
                      <div className="relative">
                        <select
                          value={selectedDistrict}
                          onChange={e => setSelectedDistrict(e.target.value)}
                          className="w-full bg-black/40 focus:ring-2 focus:ring-blue-550 focus:border-blue-500 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 backdrop-blur-md transition-all"
                        >
                          {Object.keys(DISTRICT_BASELINES).map(dist => (
                            <option key={dist} value={dist} className="bg-[#0c0e14] text-slate-200">
                              {dist} (가중치 계수 {DISTRICT_BASELINES[dist].premiumFactor}x)
                            </option>
                          ))}
                        </select>
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    {/* Area m2 */}
                    <div>
                      <div className="flex justify-between items-center text-xs text-slate-350 mb-1 font-sans">
                        <span>전용 건물면적 <strong className="text-blue-400">(건물면적_m2)</strong></span>
                        <span className="font-mono text-slate-400">{selectedArea} ㎡ (약 {Math.round(selectedArea * 0.3025)}평)</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="150"
                        step="1"
                        value={selectedArea}
                        onChange={e => setSelectedArea(Number(e.target.value))}
                        className="w-full h-1.5 bg-black/40 accent-blue-550 rounded-full cursor-pointer border border-white/5"
                      />
                    </div>

                    {/* Floor */}
                    <div>
                      <div className="flex justify-between items-center text-xs text-slate-350 mb-1 font-sans">
                        <span>배치 층수 <strong className="text-blue-400">(층)</strong></span>
                        <span className="font-mono text-slate-400">{selectedFloor} 층</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="45"
                        step="1"
                        value={selectedFloor}
                        onChange={e => setSelectedFloor(Number(e.target.value))}
                        className="w-full h-1.5 bg-black/40 accent-blue-550 rounded-full cursor-pointer border border-white/5"
                      />
                    </div>

                    {/* Build Year */}
                    <div>
                      <div className="flex justify-between items-center text-xs text-slate-350 mb-1 font-sans">
                        <span>준공연도 <strong className="text-blue-400">(건축년도)</strong></span>
                        <span className="font-mono text-slate-400">{selectedBuildYear} 년 준공</span>
                      </div>
                      <input
                        type="range"
                        min="1975"
                        max="2026"
                        step="1"
                        value={selectedBuildYear}
                        onChange={e => setSelectedBuildYear(Number(e.target.value))}
                        className="w-full h-1.5 bg-black/40 accent-blue-550 rounded-full cursor-pointer border border-white/5"
                      />
                    </div>

                    {/* Real-time formulas (Slide 3) */}
                    <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 grid grid-cols-2 gap-3 text-[10px] font-mono backdrop-blur-sm">
                      <div>
                        <span className="text-slate-400 block mb-0.5">건물나이 (수치 산출)</span>
                        <span className="text-slate-200 font-semibold">{buildingAge} 년 경과 (준공 기준)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">단위면적 평당 추적 (m2)</span>
                        <span className="text-slate-200 font-semibold">약 {unitPriceEstimate.toLocaleString()} 만원/㎡</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isAnalyzing}
                      className="w-full bg-blue-600 hover:bg-blue-500 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 text-white animate-spin" />
                          <span>특성 공학 전처리 데이터 전송 중... ({analysisStep}/11)</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4 text-white" />
                          <span className="font-bold">서울 실거래 20,666건 기반 인공지능 분석 가동</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Prediction Results or Live Logger */}
                  <div className="md:col-span-6 flex flex-col justify-between bg-black/20 backdrop-blur-md rounded-2xl p-5 border border-white/10 relative min-h-[350px] shadow-inner">
                    
                    {isAnalyzing ? (
                      <div className="flex flex-col h-full justify-between space-y-4">
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs font-mono">
                          <Activity className="animate-pulse w-4 h-4 shrink-0" />
                          <span>실시간 API 시퀀스 다이어그램 로그 추적기</span>
                        </div>
                        
                        <div className="flex-1 bg-black/50 border border-white/5 rounded-xl p-4 font-mono text-[9px] text-slate-300 space-y-2 overflow-y-auto max-h-[220px] shadow-inner">
                          {analysisLogs.map((log, index) => (
                            <div
                              key={index}
                              className={`transition-all duration-300 ${log && typeof log === 'string' && log.startsWith('❌') ? 'text-rose-400 font-bold' : 'text-slate-300'}`}
                            >
                              {String(log)}
                            </div>
                          ))}
                        </div>
                        
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div
                            className="bg-blue-500 h-full transition-all duration-150 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            style={{ width: `${Math.min(100, (analysisStep / 11) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ) : predictionResult ? (
                      <div className="space-y-5 flex flex-col h-full justify-between">
                        
                        {/* Upper Section */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/10 pb-2">
                            <span className="text-slate-400 uppercase">통합 최적 예측 수렴 결과</span>
                            <span className="text-emerald-400 font-bold bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded">
                              SUCCESS INF
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-4 items-center">
                            {/* Large Grade Circle */}
                            <div className="col-span-1 flex flex-col items-center">
                              <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl font-black ${
                                predictionResult.grade === 'A' ? 'border-amber-500 text-amber-500 bg-amber-500/15' :
                                predictionResult.grade === 'B' ? 'border-purple-500 text-purple-500 bg-purple-500/15' :
                                predictionResult.grade === 'C' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/15' :
                                'border-rose-500 text-rose-500 bg-rose-500/15'
                              }`}>
                                {predictionResult.grade}
                              </div>
                              <span className="text-[10px] text-slate-500 mt-1 font-mono">INVEST GRADE</span>
                            </div>

                            {/* Details text */}
                            <div className="col-span-2 space-y-1">
                              <span className="text-slate-400 text-[10px] block font-mono">가중 투자 적합 진단</span>
                              <h4 className="text-sm font-bold text-slate-200">{predictionResult.gradeTitle}</h4>
                              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                                {predictionResult.gradeDescription}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Middle price section */}
                        <div className="p-4.5 bg-white/5 rounded-2xl border border-white/10 space-y-1.5 shadow-md">
                          <span className="text-slate-400 font-mono text-[10px] block uppercase">예측 매매가 (정밀 앙상블 환산)</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-extrabold text-white">
                              {predictionResult.predictedPrice >= 10000
                                ? `${Math.floor(predictionResult.predictedPrice / 10000)}억 ${predictionResult.predictedPrice % 10000 > 0 ? (predictionResult.predictedPrice % 10000).toLocaleString() + '만원' : ''}`
                                : `${predictionResult.predictedPrice.toLocaleString()}만원`
                              }
                            </span>
                            <span className="text-slate-400 text-xs font-mono">({predictionResult.predictedPrice.toLocaleString()} 만원)</span>
                          </div>
                          
                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1">
                            <span>대비 비교 비율:</span>
                            <span className={predictionResult.predictedPrice >= 85000 ? 'text-amber-400' : 'text-blue-400'}>
                              중앙값 8.5억 대비 {Math.round((predictionResult.predictedPrice / 85000) * 100) - 100 > 0 ? '+' : ''}
                              {Math.round((predictionResult.predictedPrice / 85000) * 100) - 100}%
                            </span>
                          </div>
                        </div>

                        {/* Bulleted justifications */}
                        <div className="space-y-1.5 text-xs text-slate-300">
                          <span className="text-slate-400 font-mono text-[10px] block uppercase mb-1">■ 인자 가중 영향 상세</span>
                          {predictionResult.reasons.map((reason: string, idx: number) => (
                            <div key={idx} className="flex gap-2 items-start text-[11px]">
                              <span className="text-blue-400 shrink-0 mt-0.5 font-bold">•</span>
                              <span className="leading-relaxed text-slate-300">{reason}</span>
                            </div>
                          ))}
                        </div>

                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                        <Activity className="w-10 h-10 text-slate-500 animate-pulse mb-3" />
                        <h4 className="text-slate-400 text-xs font-semibold">분석 실행을 기다리고 있습니다</h4>
                        <p className="text-slate-600 text-[10px] max-w-[200px] mt-1 leading-relaxed">
                          좌측 인수를 조율하고 분석 시작 단추를 클릭하면 실시간 추론 시퀀스가 가동됩니다.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Dynamic Query Log History (Slide 8, 조회이력) */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">영속 상태 조회이력 대시보드 (Query Logs)</h3>
                    <p className="text-[11px] text-slate-400">사용자가 조회한 이력을 실시간 로깅 매핑 (ERD 조회이력 테이블 연동 모사)</p>
                  </div>
                  {queryHistory.length > 0 && activeRole === 'admin' && (
                    <button
                      onClick={handleClearHistory}
                      className="text-[10px] text-blue-405 hover:text-blue-300 font-mono font-bold hover:underline cursor-pointer"
                    >
                      테이블 비우기 (Flush DDL Log)
                    </button>
                  )}
                </div>

                {queryHistory.length > 0 ? (
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left font-sans">
                      <thead>
                        <tr className="border-b border-white/10 text-[10px] text-slate-500 font-mono uppercase">
                          <th className="pb-2 w-1/4">조회일시 (조회이력 DATETIME)</th>
                           <th className="pb-2">사용자 (USER EMAIL)</th>
                          <th className="pb-2">건물명</th>
                          <th className="pb-2">자치구</th>
                          <th className="pb-2">조회유형 (QUERY TYPE)</th>
                          <th className="pb-2 text-right">예측가액 / 등급</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono text-[11px] text-slate-300">
                        {queryHistory.map((hist, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="py-2.5 text-slate-500">{new Date(hist.query_time).toLocaleString()}</td>
                            <td className="py-2.5 text-blue-400 font-medium">{hist.user_email}</td>
                            <td className="py-2.5 font-semibold text-slate-200">{hist.apt_name}</td>
                            <td className="py-2.5 text-slate-400">{hist.district}</td>
                            <td className="py-2.5">
                              <span className="bg-black/30 px-1.5 py-0.5 rounded border border-white/5 text-[10px] text-slate-400">
                                {hist.query_type}
                              </span>
                            </td>
                            <td className="py-2.5 text-right font-bold text-white">
                              {hist.predicted_price_ten_thousand >= 10000
                                ? `${(hist.predicted_price_ten_thousand / 10000).toFixed(1)}억`
                                : `${hist.predicted_price_ten_thousand.toLocaleString()}만`
                              }
                              <span className={`ml-2 px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-extrabold rounded ${
                                hist.predicted_grade === 'A' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                hist.predicted_grade === 'B' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                hist.predicted_grade === 'C' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}>{hist.predicted_grade}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-white/10 rounded bg-black/40 text-xs text-slate-500 font-mono">
                    조회 로그가 존재하지 않습니다.
                  </div>
                )}
              </div>



            </div>
          )}

          {/* TAB 2: Filterable RAW Database Ledger */}
          {((activeRole === 'customer' && activeTab === 'ledger') || activeRole === 'operator') && (
            <div className="space-y-6">

              {/* Operator Control Deck */}
              {activeRole === 'operator' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-6">
                  
                  {/* Active Coupons Control */}
                  <div className="md:col-span-6 bg-teal-950/20 border border-teal-500/20 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.06),transparent_40%)]" />
                    <div className="flex items-start gap-4 justify-between relative z-10">
                      <div className="space-y-1">
                        <h3 className="text-xs font-bold text-teal-300 font-mono tracking-wider uppercase flex items-center gap-1.5">
                          <Ticket className="w-3.5 h-3.5" />
                          마케팅 고객 유치 쿠폰 발행기
                        </h3>
                        <p className="text-[11px] text-slate-400">우수 고객 및 재투자자 유치를 위한 가상 등급 쿠폰을 즉발 발행합니다.</p>
                      </div>
                      <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-bold shrink-0">
                        총 {couponsIssued}장 발행됨
                      </span>
                    </div>

                    {/* Interactive simulation */}
                    <div className="mt-4 flex gap-2.5">
                      <input
                        type="text"
                        placeholder="대상 고객 이메일 주소 입력"
                        id="coupon-email-target"
                        defaultValue="scv12365@gmail.com"
                        className="flex-1 bg-black/40 border border-white/15 px-3 py-2 text-xs font-mono text-slate-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
                      />
                      <button
                        onClick={() => {
                          setCouponsIssued(prev => prev + 1);
                          const emailEl = document.getElementById('coupon-email-target') as HTMLInputElement;
                          const targetMail = emailEl?.value || 'scv12365@gmail.com';
                          addToast(`[운영자 전용] ${targetMail} 고객군 대상 특별 마케팅 VIP 쿠폰 가상 발행 완료 !`, 'success');
                        }}
                        className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                      >
                        발행하기
                      </button>
                    </div>
                  </div>

                  {/* Data Anomaly & Sanity Monitoring */}
                  <div className="md:col-span-6 bg-slate-900 border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xs font-bold text-slate-300 font-mono tracking-wider uppercase flex items-center gap-1.5">
                          <Database className="w-3.5 h-3.5 text-teal-400" />
                          실거래 이상치 감지 및 누락 결측 보정
                        </h3>
                        <p className="text-[11px] text-slate-400">소수점 오차 및 노후 건축년도 결측 데이터를 실시간 트래킹합니다.</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle className="w-2.5 h-2.5" />
                        보정 연동중
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-[10px] font-mono text-slate-500">
                      <div className="bg-black/35 border border-white/5 p-2 rounded-lg">
                        <span className="block text-[8px] text-slate-400">의심 실거래 원격 건</span>
                        <strong className="text-xs text-amber-400 font-bold block mt-0.5">0건 (안전)</strong>
                      </div>
                      <div className="bg-black/35 border border-white/5 p-2 rounded-lg">
                        <span className="block text-[8px] text-slate-400">결측 년도 보정가 적용</span>
                        <strong className="text-xs text-teal-400 font-bold block mt-0.5">196건 전격 수렴</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left filter and list */}
              <div className="lg:col-span-8 p-6 space-y-4 border-r border-white/10">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-wider uppercase font-mono">서울 아파트 20,666건 실거래 내역</h2>
                    <p className="text-xs text-slate-400 mt-1">이상치 제거 및 편방향 정제 표준화 완료된 실거래 대형 원격 데이터</p>
                  </div>
                  <span className="text-[10px] bg-black/30 px-2.5 py-1 rounded-full text-slate-400 font-mono self-start border border-white/5">
                    [데모용 가상 데이터]
                  </span>
                </div>

                {/* Filter bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={ledgerSearch}
                      onChange={e => setLedgerSearch(e.target.value)}
                      placeholder="건물명, 법정동 검색..."
                      className="w-full bg-black/40 focus:ring-2 focus:ring-blue-550 border border-white/15 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-250 backdrop-blur-md transition-all"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  </div>

                  <div>
                    <select
                      value={ledgerDistrictFilter}
                      onChange={e => setLedgerDistrictFilter(e.target.value)}
                      className="w-full bg-black/40 focus:ring-2 focus:ring-blue-550 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-300 backdrop-blur-md transition-all cursor-pointer"
                    >
                      <option value="ALL" className="bg-[#0c0e14] text-slate-200">전체 자치구</option>
                      {Object.keys(DISTRICT_BASELINES).map(dist => (
                        <option key={dist} value={dist} className="bg-[#0c0e14] text-slate-200">{dist}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={ledgerGradeFilter}
                      onChange={e => setLedgerGradeFilter(e.target.value)}
                      className="w-full bg-black/40 focus:ring-2 focus:ring-blue-550 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-300 backdrop-blur-md transition-all cursor-pointer"
                    >
                      <option value="ALL" className="bg-[#0c0e14] text-slate-200">전체 투자등급</option>
                      <option value="A" className="bg-[#0c0e14] text-slate-200">Grade A (Premium)</option>
                      <option value="B" className="bg-[#0c0e14] text-slate-200">Grade B (우수)</option>
                      <option value="C" className="bg-[#0c0e14] text-slate-200">Grade C (일반)</option>
                      <option value="D" className="bg-[#0c0e14] text-slate-200">Grade D (보수)</option>
                    </select>
                  </div>
                </div>

                {/* Ledger Table */}
                <div className="overflow-x-auto border border-white/10 rounded-xl bg-black/30 max-h-[420px] overflow-y-auto shadow-inner">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="sticky top-0 bg-[#161a25]/95 backdrop-blur-sm shadow-md z-10">
                      <tr className="text-slate-400 border-b border-white/10 font-mono text-[10px] uppercase">
                        <th className="p-3">건물명 (아파트)</th>
                        <th className="p-3">자치구-법정동</th>
                        <th className="p-3">전용면적</th>
                        <th className="p-3">층수</th>
                        <th className="p-3 text-right">매매가 (억원)</th>
                        <th className="p-3 text-right">투자등급</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredRecords.length > 0 ? (
                        filteredRecords.map((rec) => (
                          <tr
                            key={rec.id}
                            onClick={() => setSelectedLedgerRow(rec)}
                            className={`hover:bg-white/5 cursor-pointer transition-all ${
                              selectedLedgerRow?.id === rec.id ? 'bg-white/10 border-l-4 border-blue-500' : ''
                            }`}
                          >
                            <td className="p-3 font-semibold text-white">{rec.apt_name}</td>
                            <td className="p-3 text-slate-400 font-mono">{rec.district} {rec.dong}</td>
                            <td className="p-3 text-slate-400 font-mono">{rec.area_m2} ㎡</td>
                            <td className="p-3 text-slate-400 font-mono">{rec.floor} 층</td>
                            <td className="p-3 text-right font-bold text-slate-200 font-mono">
                              {(rec.price_ten_thousand / 10000).toFixed(1)} 억
                            </td>
                            <td className="p-3 text-right">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold ${
                                rec.grade === 'A' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                rec.grade === 'B' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                rec.grade === 'C' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}>{rec.grade}</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-neutral-500 font-mono">
                            조건에 일치하는 서울 실거래가 레코드가 존재하지 않습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right details sidebar drawer (Slide 8 ERD Join specifications) */}
              <div className="lg:col-span-4 p-6 bg-black/30 backdrop-blur-md flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10">
                {selectedLedgerRow ? (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/10 pb-2 mb-4">
                        <span className="text-blue-400 font-bold uppercase">상세 부동산 및 거래 정보</span>
                        <span className="bg-white/5 text-slate-400 px-1.5 py-0.5 rounded border border-white/10">
                          APTID: {selectedLedgerRow.id}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{selectedLedgerRow.apt_name}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedLedgerRow.district} {selectedLedgerRow.dong}</p>
                    </div>

                    {/* Table-by-Table matching details */}
                    <div className="space-y-3.5 text-xs text-slate-300">
                      
                      {/* Entity 1: Apartment Info */}
                      <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-blue-400 font-mono font-bold block mb-1">■ 아파트 (Core Entity)</span>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[11px] text-slate-400">
                          <span>아파트명: <span className="text-white">{selectedLedgerRow.apt_name}</span></span>
                          <span>건축년도: <span className="text-white">{selectedLedgerRow.build_year}년</span></span>
                          <span>전용면적: <span className="text-white">{selectedLedgerRow.area_m2}㎡</span></span>
                          <span>해당층수: <span className="text-white">{selectedLedgerRow.floor}층</span></span>
                        </div>
                      </div>

                      {/* Entity 2: Real Transaction details */}
                      <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-emerald-450 font-mono font-bold block mb-1">■ 실거래 (Transaction Table)</span>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[11px] text-slate-400">
                          <span>계약일시: <span className="text-white">{selectedLedgerRow.deal_date}</span></span>
                          <span>신고구분: <span className="text-white">{selectedLedgerRow.report_type}</span></span>
                          <span className="col-span-2">계약매매가격: <strong className="text-emerald-400">{(selectedLedgerRow.price_ten_thousand / 10000).toFixed(2)} 억원</strong> ({selectedLedgerRow.price_ten_thousand.toLocaleString()} 만원)</span>
                        </div>
                      </div>

                      {/* Entity 3: Feature variables */}
                      <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-amber-400 font-mono font-bold block mb-1">■ 파생변수 (Feature Table - 1:1)</span>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[11px] text-slate-400">
                          <span>건물나이: <span className="text-white">{selectedLedgerRow.age}년 경과</span></span>
                          <span>역세등급: <span className="text-white">{selectedLedgerRow.subway_grade}</span></span>
                          <span className="col-span-2">㎡당 평단가: <span className="text-amber-400 font-semibold">{selectedLedgerRow.price_per_m2.toLocaleString()} 만원/㎡</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Pre-fill Action button */}
                    <button
                      onClick={() => handleLoadRowIntoForm(selectedLedgerRow)}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-blue-300 font-bold py-2.5 rounded-full text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      이 데이터 조율기에 불려오기
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-600 font-mono text-xs">
                    상세 뷰를 확인할 행을 목록에서 선택하십시오.
                  </div>
                )}

                <div className="text-[10px] text-slate-500 font-mono border-t border-white/10 pt-3 text-center mt-4">
                  데이터는 Slide 8 <strong className="text-slate-400">Physical Database Entity Join Model</strong> 구조를 완제품 형태로 시뮬레이션하고 있습니다.
                </div>
              </div>

              </div>



            </div>
          )}

          {/* TAB 3: Chart metrics */}
          {((activeRole === 'customer' && activeTab === 'metrics') || activeRole === 'ai_engine') && (
            <div className="space-y-6">

              {/* ML Core Engine Room */}
              {activeRole === 'ai_engine' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-6">
                
                {/* Retrain Parameter Optimizer */}
                <div className="md:col-span-7 bg-amber-950/20 border border-amber-500/20 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.06),transparent_40%)]" />
                  <div className="flex items-start justify-between relative z-10 gap-4">
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-amber-300 font-mono tracking-wider uppercase flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Random Forest 모델 하이퍼파라미터 가중 보정
                      </h3>
                      <p className="text-[11px] text-slate-400 font-sans">
                        본 앙상블 기계의 가중 가중치 파이프라인을 재학습하여 잔차 오차 분포(MAE, MSE)를 보정 합성합니다.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        addToast(`[AI 엔진] Random Forest 앙상블 훈련 및 StandardScaler 파이프라인 가중치 연동 보완 (R²: 0.895 극대화)!`, 'success');
                      }}
                      className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    >
                      훈련 기동 (ML)
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-[10px] font-mono text-center">
                    <div className="bg-black/30 p-2 border border-white/5 rounded-lg">
                      <span className="text-slate-500 block text-[8px]">n_estimators</span>
                      <span className="text-white font-bold block mt-0.5">200 (Ensemble)</span>
                    </div>
                    <div className="bg-black/30 p-2 border border-white/5 rounded-lg">
                      <span className="text-slate-500 block text-[8px]">max_depth</span>
                      <span className="text-white font-bold block mt-0.5">10 (Pruned)</span>
                    </div>
                    <div className="bg-black/30 p-2 border border-white/5 rounded-lg">
                      <span className="text-slate-500 block text-[8px]">R-Squared</span>
                      <span className="text-emerald-400 font-bold block mt-0.5">0.891 (우수)</span>
                    </div>
                  </div>
                </div>

                {/* Active loss & convergence indicator */}
                <div className="md:col-span-5 bg-slate-900 border border-white/5 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-300 font-mono tracking-wider uppercase flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      모사 오프라인 앙상블 정합성
                    </h3>
                    <p className="text-[11px] text-slate-400">분류 클래스 및 수동 결측치 정규화 보조 가중 표준 편차 가중</p>
                  </div>

                  <div className="text-[10px] font-mono flex items-center justify-between text-slate-400 mt-4 bg-black/35 border border-white/5 p-2 rounded-lg">
                    <span>Standard Deviation (σ):</span>
                    <strong className="text-amber-400 font-bold">±12.45m² (Norm)</strong>
                  </div>
                </div>
              </div>
            )}
            {/* Performance Indicator Component */}
              <PerformanceDashboard />

              {/* DFD Data pipeline process graph (Slide 9, 시스템 아키텍처 DFD) */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">시스템 아키텍처 및 DFD (Data Flow Diagram) 파이프 흐름</h3>
                    <p className="text-xs text-slate-400">사용자 인풋 수치가 인공지능 통합 결과를 거쳐 가시화되는 물리적 통로</p>
                  </div>
                  <span className="text-xs text-blue-400 font-mono font-bold uppercase">DFD LEVEL 1</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                  
                  {/* Step 1 */}
                  <div className="bg-black/20 p-5 rounded-2xl border border-white/10 space-y-2 relative overflow-hidden transition-all hover:bg-black/30 shadow-inner group">
                    <div className="absolute top-0 right-0 bg-[#1a2333] border-b border-l border-white/10 text-blue-400 px-2.5 py-0.5 rounded-bl font-bold text-[9px]">P1</div>
                    <span className="text-slate-400 font-bold block mb-1">1. 입력 처리 & 전처리</span>
                    <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                      자치구, 면적, 층, 연식을 입력받고 Standardscaler 매트릭스와 파생변수(건물나이 등)를 추출 가공합니다.
                    </p>
                    <div className="text-[10px] text-blue-300 bg-blue-500/10 p-1.5 rounded-lg font-mono text-center border border-blue-500/20">
                      StandardScaler + Vector
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-black/20 p-5 rounded-2xl border border-white/10 space-y-2 relative overflow-hidden transition-all hover:bg-black/30 shadow-inner group">
                    <div className="absolute top-0 right-0 bg-[#1a2333] border-b border-l border-white/10 text-blue-400 px-2.5 py-0.5 rounded-bl font-bold text-[9px]">P2</div>
                    <span className="text-slate-400 font-bold block mb-1">2. 분류 모델 추론 (RF)</span>
                    <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                      Random Forest Classifier가 수립된 파생변수를 입력받아 A, B, C, D 4개 역세 결합 투자등급 타겟 판정을 도출합니다.
                    </p>
                    <div className="text-[10px] text-blue-300 bg-blue-500/10 p-1.5 rounded-lg font-mono text-center border border-blue-500/20">
                      n_estimators=200, depth=10
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-black/20 p-5 rounded-2xl border border-white/10 space-y-2 relative overflow-hidden transition-all hover:bg-black/30 shadow-inner group">
                    <div className="absolute top-0 right-0 bg-[#1a2333] border-b border-l border-white/10 text-blue-400 px-2.5 py-0.5 rounded-bl font-bold text-[9px]">P3</div>
                    <span className="text-slate-400 font-bold block mb-1">3. 회귀 모델 추론 (RF Reg)</span>
                    <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                      Random Forest Regressor가 병렬 기조를 발맞추어 대상 아파트의 최적 환산 실 매매가액(만원)을 산정합니다.
                    </p>
                    <div className="text-[10px] text-blue-300 bg-blue-500/10 p-1.5 rounded-lg font-mono text-center border border-blue-500/20">
                      MAE ±820만 | R² 0.891
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-black/20 p-5 rounded-2xl border border-white/10 space-y-2 relative overflow-hidden transition-all hover:bg-black/30 shadow-inner group">
                    <div className="absolute top-0 right-0 bg-[#1a2333] border-b border-l border-white/10 text-blue-400 px-2.5 py-0.5 rounded-bl font-bold text-[9px]">P4</div>
                    <span className="text-slate-400 font-bold block mb-1">4. 결과 통합 & 시각화</span>
                    <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                      분류(Grade, Title, Desc)와 회귀(매매가, 중앙대비 편차) 인자를 최종 인출하여 고객 연계 및 이력 저장을 완료합니다.
                    </p>
                    <div className="text-[10px] text-blue-300 bg-blue-500/10 p-1.5 rounded-lg font-mono text-center border border-blue-500/20">
                      통합 Dashboard 출력
                    </div>
                  </div>

                </div>
              </div>



            </div>
          )}

          {/* TAB 4: 기획 설계 검토 보고서 (STEP A) */}
          {activeRole === 'customer' && activeTab === 'report' && (
            <div className="space-y-6">
              <ReviewReport />
              

            </div>
          )}

          {/* TAB 5: 소스 추출 & 완결 파일 덤프 (ddl, HTML mockup) */}
          {((activeRole === 'customer' && activeTab === 'export') || activeRole === 'admin') && (
            <div className="space-y-6">

              {/* Admin Override Room */}
              {activeRole === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-6">
                {/* Simulation Exception Override */}
                <div className="md:col-span-7 bg-blue-950/20 border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.06),transparent_40%)]" />
                  <div className="flex items-start justify-between relative z-10 gap-4">
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-blue-300 font-mono tracking-wider uppercase flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        예외 처리 설계 연동 - 의도적 주소 이상 오류 (Error 400)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        비동기 API 처리 과정 중 사용자 주소지 가용 범위가 초과되었을 때의 오류 통제 시퀀스를 동작 모사합니다.
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setIntentionalError(!intentionalError);
                        addToast(`의도적 주소 예외 분기가 ${!intentionalError ? '활성화' : '비활성화'}되었습니다.`, 'info');
                      }}
                      className={`shrink-0 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-md ${
                        intentionalError ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {intentionalError ? '오류 유도 가동중' : '정상 작동 모드'}
                    </button>
                  </div>
                  
                  <div className="mt-3 bg-black/45 border border-white/5 p-3 rounded-lg text-[10.5px] text-slate-400 leading-relaxed font-mono">
                    {intentionalError ? (
                      <span className="text-rose-400 font-bold block">
                        ⚠️ 활성상태: 고객이 "인공지능 분석 가동"을 누를 시 4단계 전처리 단계(Step 3)에서 통제 가능 오류(400)가 시뮬레이트됩니다.
                      </span>
                    ) : (
                      <span className="text-emerald-400 block">
                        ✓ 비활성상태: 모든 AI 파이프라인 연산이 정상 도출되며 A~C 실거래 등급 판정이 완료됩니다.
                      </span>
                    )}
                  </div>
                </div>

                {/* DDL Backup logs */}
                <div className="md:col-span-5 bg-slate-900 border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-slate-300 font-mono tracking-wider uppercase flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-blue-400" />
                        물리 DDL 백업 및 ERD 아카이브
                      </h3>
                      <p className="text-[11px] text-slate-400">원천 스키마 테이블 구성을 즉시 덤프 백업합니다.</p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4 text-[10px] font-mono">
                    <button
                      onClick={() => {
                        addToast(`관리자 권한: 20,666건의 물리 원본 테이블 DDL 연산 및 JSON 덤프 100% 무결성 백업 성공!`, 'success');
                      }}
                      className="w-full bg-[#1e293b] hover:bg-[#334155] text-slate-300 font-bold py-2 px-3 rounded-lg transition-all text-left flex items-center justify-between border border-white/5"
                    >
                      <span>PostgreSQL DDL 스키마 백업</span>
                      <span className="text-blue-400 underline">즉시 백업</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
              
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Code className="w-5 h-5 text-blue-400" />
                      개발자 도구 (Developer Console) & 100% 동작 오프라인 HTML 덤프
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">시스템 ERD DDL 구성 확인 및 브라우저 독립적으로 즉시 가동하는 단일 HTML Mockup 내려받기</p>
                  </div>
                  
                  {/* Standalone HTML compiled down helper */}
                  <button
                    onClick={handleDownloadOfflineMockup}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.45)] transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-white" />
                    오프라인 Mockup HTML 다운로드
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* DDL explanations */}
                  <div className="lg:col-span-5 space-y-4">
                    <h3 className="text-xs font-bold text-blue-400 font-mono tracking-wider uppercase">물리 테이블 무결성 DDL 구조 총평</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      본 PostgreSQL DDL 스크립트는 Slide 8 <strong>"7. 데이터베이스 설계 (ERD)"</strong>에서 제시하는 구조를 빈틈 없이 실 물리적 형태 데이터로 환산 구체화한 설계도입니다.
                    </p>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex gap-2 items-start text-[11px]">
                        <span className="bg-black/30 border border-white/10 px-2 py-0.5 rounded-md font-mono text-blue-400">users</span>
                        <span className="text-slate-300">사용자 테이블: 가입등급(일반/프리미엄)과 매핑 구조화</span>
                      </div>
                      <div className="flex gap-2 items-start text-[11px]">
                        <span className="bg-black/30 border border-white/10 px-2 py-0.5 rounded-md font-mono text-blue-400">apartments</span>
                        <span className="text-slate-300">코어 아파트: 자치구, 법정동, 건물명, 전용면적 등 인풋 핵심 필드 배포</span>
                      </div>
                      <div className="flex gap-2 items-start text-[11px]">
                        <span className="bg-black/30 border border-white/10 px-2 py-0.5 rounded-md font-mono text-blue-400">transactions</span>
                        <span className="text-slate-300">실거래 계약 이력: 계약 매매가격(만원) 및 신고유형</span>
                      </div>
                      <div className="flex gap-2 items-start text-[11px]">
                        <span className="bg-black/30 border border-white/10 px-2 py-0.5 rounded-md font-mono text-blue-400">derived_features</span>
                        <span className="text-slate-300">파생 정규 피처: 건물나이, m2당 평단가, 역세권등급 (1:1 강력한 바인딩)</span>
                      </div>
                      <div className="flex gap-2 items-start text-[11px]">
                        <span className="bg-black/30 border border-white/10 px-2 py-0.5 rounded-md font-mono text-blue-400">query_histories</span>
                        <span className="text-slate-300">조회 이력: 어떤 사용자가 어떤 아파트의 AI 추론을 어떤 목적(query_type)으로 조회하였는지 시간별 영속 로깅</span>
                      </div>
                    </div>

                    <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl text-[11px] text-slate-300 leading-relaxed">
                      <strong>💡 복합 인덱스(Composite Indices) 적용:</strong> 아파트 자치구 정렬 조회 및 실거래 계약 시세 가중 최적화를 위해 테이블 끝단 인덱스 매커니즘이 수렴되어 물리적 로드 Latency를 극소 수준으로 지탱합니다.
                    </div>
                  </div>

                  {/* Database Code Block */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-3.5">
                    <div className="flex justify-between items-center bg-black/40 px-4 py-2.5 rounded-t-xl border-t border-x border-white/10 text-xs">
                      <span className="font-mono text-slate-400">postgresql_schema_ddl.sql</span>
                      <button
                        onClick={handleCopyDDL}
                        className="text-xs text-blue-400 hover:text-blue-300 font-mono font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-blue-500" />
                        스크립트 복사
                      </button>
                    </div>
                    <pre className="flex-1 bg-black/30 border-b border-x border-white/10 text-slate-300 p-4.5 rounded-b-xl font-mono text-[9px] leading-relaxed overflow-x-auto max-h-[300px] overflow-y-auto shadow-inner">
                      <code>{ddlScript}</code>
                    </pre>
                  </div>

                </div>
              </div>



            </div>
          )}

        </main>
      </div>

      {/* Footer information bar */}
      <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md text-center py-8 text-xs text-slate-500 font-mono mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>RealScore Pro 통합 ML 예측·판정 클라이언트 엔진 © 2026. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-[10px] text-slate-600 block">학번: K2025013 | 설계수립: 김민수</span>
            <span className="text-[10px] text-slate-600 block">System Locale: Seoul-UTC-9h</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
