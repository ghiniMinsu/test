export function compileOfflineMockupHTML(): string {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RealScore Pro - 100% Offline Mockup App</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Inter', sans-serif;
      background-color: #0b0f19;
    }
    /* Simple Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #0f172a;
    }
    ::-webkit-scrollbar-thumb {
      background: #334155;
      border-radius: 3px;
    }
  </style>
</head>
<body class="text-slate-100 min-h-screen flex flex-col antialiased">

  <!-- Header -->
  <header class="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="bg-gradient-to-tr from-amber-500 to-indigo-600 p-2.5 rounded-lg shadow-md shrink-0">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold tracking-tight text-white">RealScore Pro</h1>
            <span class="bg-indigo-950/80 border border-indigo-700/50 text-[10px] text-indigo-300 font-mono font-bold px-1.5 py-0.2 rounded">
              OFFLINE TRIAL v2.0
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">서울시 아파트 실거래가 기반 시세예측 + 투자등급 통합 판정 (가상 가상 환경)</p>
        </div>
      </div>
      
      <!-- Key Stats Badges -->
      <div class="flex flex-wrap items-center gap-2 text-xs font-mono">
        <div class="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span class="text-slate-400">학습 레코드: <strong class="text-white">20,666건</strong></span>
        </div>
        <div class="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-400">
          알고리즘: <strong class="text-amber-400">Random Forest (n=200)</strong>
        </div>
      </div>
    </div>
  </header>

  <!-- Navigation / Main Layout -->
  <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
    
    <!-- LEFT PANEL: Dynamic Controls -->
    <section class="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6 self-start shadow-xl">
      <div>
        <h2 class="text-sm font-bold text-slate-200 tracking-wider uppercase font-mono mb-1">인풋 파라메타 조율</h2>
        <p class="text-xs text-slate-400">예측할 서울 아파트 상세정보를 입력하면 RandomForest가 가동됩니다.</p>
      </div>

      <form id="inferenceForm" class="space-y-4" onsubmit="event.preventDefault(); runAnalysis();">
        <!-- 1. District -->
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1.5">자치구 선택</label>
          <select id="district" class="w-full bg-slate-950 focus:ring-2 focus:ring-indigo-500 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200" onchange="updateCalculations()">
            <option value="강남구" selected>강남구 (프리미엄 1.8x)</option>
            <option value="서초구">서초구 (프리미엄 1.6x)</option>
            <option value="송파구">송파구 (프리미엄 1.4x)</option>
            <option value="용산구">용산구 (프리미엄 1.35x)</option>
            <option value="성동구">성동구 (준프리미엄 1.2x)</option>
            <option value="마포구">마포구 (준프리미엄 1.15x)</option>
            <option value="노원구">노원구 (가성비 0.75x)</option>
            <option value="도봉구">도봉구 (가성비 0.62x)</option>
          </select>
        </div>

        <!-- 2. Area slider -->
        <div>
          <div class="flex justify-between text-xs font-semibold text-slate-300 mb-1">
            <span>건물면적 (㎡)</span>
            <span id="areaVal" class="text-slate-400">84 ㎡ (약 25평)</span>
          </div>
          <input type="range" id="area" min="30" max="150" value="84" class="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer" oninput="updateCalculations()">
        </div>

        <!-- 3. Floor slider -->
        <div>
          <div class="flex justify-between text-xs font-semibold text-slate-300 mb-1">
            <span>해당동 호수 층수</span>
            <span id="floorVal" class="text-slate-400">15 층</span>
          </div>
          <input type="range" id="floor" min="1" max="45" value="15" class="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer" oninput="updateCalculations()">
        </div>

        <!-- 4. Build Year -->
        <div>
          <div class="flex justify-between text-xs font-semibold text-slate-300 mb-1">
            <span>건축년도 (준공)</span>
            <span id="buildYearVal" class="text-slate-400">2015 년</span>
          </div>
          <input type="range" id="buildYear" min="1975" max="2026" value="2015" class="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer" oninput="updateCalculations()">
        </div>

        <!-- Automatic calculations -->
        <div class="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-2 text-[11px] font-mono">
          <div class="flex justify-between">
            <span class="text-slate-500">건물나이 (자동계산):</span>
            <span id="calcAge" class="text-indigo-400 font-semibold">11 년 (구축 전환기)</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">단위면적 대비 평당 분석:</span>
            <span id="calcUnit" class="text-indigo-400 font-semibold">자동 계산 대기</span>
          </div>
        </div>

        <!-- Run action -->
        <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 font-semibold text-sm py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0y" />
          </svg>
          실시간 AI 분석 가동하기
        </button>
      </form>
    </section>

    <!-- RIGHT PANEL: Dashboard Output -->
    <section class="lg:col-span-8 space-y-6">
      
      <!-- Stepper loader (Simulating 12-Step pipeline in Slide 10) -->
      <div id="pipelineLoader" class="hidden bg-slate-900 border border-indigo-900/50 rounded-2xl p-5 relative overflow-hidden">
        <div class="flex items-center gap-3 mb-4">
          <svg class="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm font-semibold text-white">머신러닝 추론 파이프라인 가동 (수명 주기 시그널 추적)</span>
        </div>
        <div id="pipelineSteps" class="space-y-1.5 font-mono text-[10px] text-slate-400">
          <div class="text-indigo-400 font-bold">> [1] 부동산 분석 파라메터 정보 제출 완료</div>
          <div class="text-indigo-400 font-bold">> [2] 원시 데이터 실시간 이송 완료</div>
        </div>
      </div>

      <!-- Main Prediction Output Card -->
      <div id="predictionResultCard" class="bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div class="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl text-indigo-500"></div>
        
        <div class="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
          <h3 class="text-sm font-bold text-slate-350 tracking-wider font-mono">인공지능 모델 통합 판정 결과</h3>
          <span class="text-xs text-amber-400 font-mono flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            분석 완료
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
          <!-- Grade area -->
          <div class="md:col-span-2 flex flex-col items-center justify-center p-5 bg-slate-950/80 border border-slate-800 rounded-xl relative overflow-hidden group">
            <div id="gradeBadgeContainer" class="w-24 h-24 rounded-full border-4 border-emerald-500 flex items-center justify-center font-sans font-black text-4xl text-emerald-400 shadow-lg mb-3">
              B
            </div>
            <span id="gradeTitle" class="text-base font-bold text-white mb-1">투자 매우 우수</span>
            <span id="gradeDesc" class="text-[11px] text-slate-400 text-center">입지와 년식 대비 안정적인 자산 가치 형성 완료</span>
          </div>

          <!-- Price & Justification details -->
          <div class="md:col-span-3 space-y-4">
            <div>
              <span class="text-xs text-slate-400 font-medium">예측 매매가 (만원 단위 환산 적용)</span>
              <div class="flex items-baseline gap-2 mt-1">
                <span id="predictedPrice" class="text-3xl font-extrabold text-white">13억 5,000만원</span>
              </div>
              <p id="priceVsMedian" class="text-xs text-slate-500 mt-1">실거래 데이터 중앙값(8.5억) 대비 약 +59% 상회</p>
            </div>

            <!-- Justifications (Groundings) -->
            <div class="space-y-2 border-t border-slate-800/80 pt-3">
              <span class="text-xs font-semibold text-indigo-400 font-mono block">■ 인공지능 분석 가중 영향 요인</span>
              <ul id="reasonsList" class="space-y-1.5 text-xs text-slate-300">
                <li class="flex items-start gap-2">
                  <span class="text-emerald-500 shrink-0 select-none">•</span>
                  <span>건물나이 11년 — 신축급 및 주거 선호도 우수</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-emerald-500 shrink-0 select-none">•</span>
                  <span>강남구 입지 — 최고의 시세 지지력 확보</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Simple Interactive Data Table -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div>
            <h3 class="text-sm font-bold text-white tracking-wider">실거래 및 파생변수 Ledger</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">최근 거래 이력 5건 (행 클릭 시 자동 파라메타 주입 복사)</p>
          </div>
          <span class="text-[10px] bg-slate-950 border border-slate-800 px-2 py-1 rounded text-slate-400 font-mono">
            [데모용 가상 데이터]
          </span>
        </div>

        <div class="overflow-x-auto text-xs">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th class="p-3">건물명</th>
                <th class="p-3">자치구</th>
                <th class="p-3">전용면적</th>
                <th class="p-3">층</th>
                <th class="p-3">건물나이</th>
                <th class="p-3">투자등급</th>
                <th class="p-3 text-right">매매가</th>
              </tr>
            </thead>
            <tbody id="interactiveTable" class="divide-y divide-slate-850">
              <!-- Loaded dynamically -->
            </tbody>
          </table>
        </div>
      </div>

    </section>
  </main>

  <footer class="bg-slate-950 border-t border-slate-800 text-center py-6 text-xs text-slate-500 font-mono">
    <p>RealScore Pro © 2026. Designed with Google AI Studio specifications. All rights reserved.</p>
  </footer>

  <!-- Script logic mimicking our surrogate ML and slide specs -->
  <script>
    // Seoul baselines
    const baselines = {
      '강남구': { pricePerM2: 2450, premiumFactor: 1.8 },
      '서초구': { pricePerM2: 2200, premiumFactor: 1.6 },
      '송파구': { pricePerM2: 1800, premiumFactor: 1.4 },
      '용산구': { pricePerM2: 1750, premiumFactor: 1.35 },
      '성동구': { pricePerM2: 1450, premiumFactor: 1.2 },
      '마포구': { pricePerM2: 1380, premiumFactor: 1.15 },
      '노원구': { pricePerM2: 820, premiumFactor: 0.75 },
      '도봉구': { pricePerM2: 690, premiumFactor: 0.62 },
    };

    // Database entries
    const ledger = [
      { name: '아크로리버파크', dist: '서초구', area: 84, floor: 22, buildYear: 2016, price: 243000, grade: 'A' },
      { name: '은마아파트', dist: '강남구', area: 76, floor: 12, buildYear: 1979, price: 195000, grade: 'A' },
      { name: '래미안 퍼스티지', dist: '서초구', area: 114, floor: 18, buildYear: 2009, price: 238000, grade: 'A' },
      { name: '헬리오시티', dist: '송파구', area: 84, floor: 15, buildYear: 2018, price: 165000, grade: 'B' },
      { name: '마포래미안푸르지오', dist: '마포구', area: 84, floor: 14, buildYear: 2014, price: 148000, grade: 'B' },
    ];

    function updateCalculations() {
      const dist = document.getElementById('district').value;
      const area = parseInt(document.getElementById('area').value);
      const floor = parseInt(document.getElementById('floor').value);
      const buildYear = parseInt(document.getElementById('buildYear').value);

      // Labels
      document.getElementById('areaVal').innerText = area + ' ㎡ (약 ' + Math.round(area * 0.3025) + '평)';
      document.getElementById('floorVal').innerText = floor + ' 층';
      document.getElementById('buildYearVal').innerText = buildYear + ' 년';

      // Age
      const age = 2026 - buildYear;
      document.getElementById('calcAge').innerText = age + ' 년 (' + (age <= 5 ? '신축급 우위' : age <= 12 ? '준신축 양호' : '지속 감가 구축') + ')';

      // Unit Calc
      const base = baselines[dist] || { pricePerM2: 1000 };
      const currentUnit = Math.round(base.pricePerM2 * (floor >= 11 ? 1.05 : 1.0));
      document.getElementById('calcUnit').innerText = '약 ' + currentUnit.toLocaleString() + ' 만원/㎡';
    }

    function rowClick(name, dist, area, floor, buildYear) {
      document.getElementById('district').value = dist;
      document.getElementById('area').value = area;
      document.getElementById('floor').value = floor;
      document.getElementById('buildYear').value = buildYear;
      updateCalculations();
      runAnalysis();
    }

    function runAnalysis() {
      // Show dynamic loader simulating 12 Sequence flowchart items
      const loader = document.getElementById('pipelineLoader');
      const logger = document.getElementById('pipelineSteps');
      loader.classList.remove('hidden');
      logger.innerHTML = '';

      const steps = [
        '[1] 주택 정보 (자치구, 층, 년식) 서버 제출',
        '[2] 전처리 모듈에 원시 수치 인가 이송',
        '[3] 파생 변수 특성 공학 (건물나이, 평단가 연계) 정산',
        '[5] 가중치 One-Hot 및 StandardScaler 기조 매핑',
        '[6] [par] Random Forest 분류 앙상블 다수결 연계 진입',
        '[7] [par] 분류 성능 판정 및 등급 A/B/C/D 분리 완료',
        '[8] [par] Random Forest Regressor 앙상블 매매가 회귀 추론',
        '[10] 최종 수치 저장 이력 DB 가동 완수',
        '[11] 대시보드 인터페이스 렌더링 준비 완결'
      ];

      let i = 0;
      const t = setInterval(() => {
        if (i < steps.length) {
          logger.innerHTML += '<div class="text-indigo-400 font-medium">> ' + steps[i] + '... 완료</div>';
          i++;
        } else {
          clearInterval(t);
          loader.classList.add('hidden');
          displayPredictions();
        }
      }, 150);
    }

    function displayPredictions() {
      const dist = document.getElementById('district').value;
      const area = parseInt(document.getElementById('area').value);
      const floor = parseInt(document.getElementById('floor').value);
      const buildYear = parseInt(document.getElementById('buildYear').value);

      const base = baselines[dist] || { pricePerM2: 1000, premiumFactor: 1.0 };
      const age = 2026 - buildYear;

      let pM2 = base.pricePerM2;
      if (age < 5) pM2 *= 1.22;
      else if (age < 12) pM2 *= 1.10;
      else if (age > 20) pM2 *= 0.85;

      if (floor >= 25) pM2 *= 1.10;
      else if (floor >= 11) pM2 *= 1.05;
      else if (floor <= 3) pM2 *= 0.92;

      let estPrice = Math.round(pM2 * area);
      estPrice = Math.max(7000, Math.min(243000, estPrice));

      // Grade
      let grade = 'C';
      let title = '투자 일반';
      let desc = '보통 수준의 시장 평균 대비 방어력 보유';
      let badgeColor = 'emerald';

      if (estPrice >= 180000 || (pM2 >= 2000 && base.premiumFactor >= 1.5)) {
        grade = 'A';
        title = '투자 최적 (Premium)';
        desc = '최상의 입지와 우수한 자본 수익률 기여 가능';
        badgeColor = 'amber';
      } else if (estPrice >= 115000 || (pM2 >= 1300 && base.premiumFactor >= 1.1)) {
        grade = 'B';
        title = '투자 매우 우수';
        desc = '입지와 년식 대비 안정적인 자산 가치 형성 완료';
        badgeColor = 'purple';
      } else if (estPrice < 65000) {
        grade = 'D';
        title = '보수적 접근 필요';
        desc = '시세 방어가 둔탁하여 부채 부담 완급이 요구됨';
        badgeColor = 'rose';
      }

      // Update badge UI
      const badge = document.getElementById('gradeBadgeContainer');
      badge.innerText = grade;
      badge.className = "w-24 h-24 rounded-full border-4 flex items-center justify-center font-sans font-black text-4xl shadow-lg mb-3 " + 
        (grade === 'A' ? "border-amber-500 text-amber-500" : 
         grade === 'B' ? "border-purple-500 text-purple-500" : 
         grade === 'C' ? "border-emerald-500 text-emerald-500" : "border-rose-500 text-rose-500");

      document.getElementById('gradeTitle').innerText = title;
      document.getElementById('gradeDesc').innerText = desc;

      // Price text formatting (e.g. 13억 5,000만원)
      let priceText = '';
      if (estPrice >= 10000) {
        const eok = Math.floor(estPrice / 10000);
        const remainder = estPrice % 10000;
        priceText = eok + '억' + (remainder > 0 ? ' ' + remainder.toLocaleString() + '만원' : '');
      } else {
        priceText = estPrice.toLocaleString() + '만원';
      }
      document.getElementById('predictedPrice').innerText = priceText;

      // Difference
      const diffLabel = document.getElementById('priceVsMedian');
      const ratio = Math.round((estPrice / 85000) * 100) - 100;
      if (ratio > 0) {
        diffLabel.innerText = '서울 아파트 실거래 중앙값(8.5억) 대비 약 +' + ratio + '% 우위';
      } else {
        diffLabel.innerText = '서울 아파트 실거래 중앙값(8.5억) 대비 약 ' + ratio + '% 할인';
      }

      // Reasons
      const reasonsList = document.getElementById('reasonsList');
      reasonsList.innerHTML = '';
      
      const reasons = [
        '건물나이 ' + age + '년 — ' + (age <= 5 ? '신축 압도적 주거 메리트 극대화' : age <= 12 ? '상대적 소모 마모 감소 준신축급' : '구축 감가 상태 반영'),
        dist + ' 입지 — ' + (base.premiumFactor >= 1.5 ? '서울 핵심 요충 시세 주도 구역' : '안정적 주택 지지선 형성 구역'),
        floor + '층 — ' + (floor >= 20 ? '뷰 및 일조권 로열 메리트' : '안정적 무난 프라이버시 선호도')
      ];

      reasons.forEach(r => {
        reasonsList.innerHTML += '<li class="flex items-start gap-2"><span class="text-indigo-400 shrink-0 select-none">•</span><span>' + r + '</span></li>';
      });
    }

    // Populate table
    function populateLedger() {
      const tbody = document.getElementById('interactiveTable');
      tbody.innerHTML = '';
      ledger.forEach(item => {
        const age = 2026 - item.buildYear;
        const formattedPrice = (item.price / 10000).toFixed(1) + '억원';
        
        tbody.innerHTML += \`<tr class="hover:bg-slate-800/40 cursor-pointer transition-colors" onclick="rowClick('\${item.name}', '\${item.dist}', \${item.area}, \${item.floor}, \${item.buildYear})">
          <td class="p-3 font-semibold text-white">\${item.name}</td>
          <td class="p-3 text-slate-400">\${item.dist}</td>
          <td class="p-3 text-slate-400">\${item.area} ㎡</td>
          <td class="p-3 text-slate-400">\${item.floor} 층</td>
          <td class="p-3 text-slate-400">\${age} 년</td>
          <td class="p-3">\`<span class="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold \${
            item.grade === 'A' ? 'bg-amber-950/80 text-amber-400 border border-amber-800' :
            item.grade === 'B' ? 'bg-purple-950/80 text-purple-400 border border-purple-800' :
            item.grade === 'C' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' : 'bg-rose-950/80 text-rose-400 border border-rose-800'
          }">\${item.grade}</span>\`</td>
          <td class="p-3 text-right font-mono font-bold text-slate-200">\${formattedPrice}</td>
        </tr>\`;
      });
    }

    // Init
    updateCalculations();
    populateLedger();
  </script>
</body>
</html>`;
}
