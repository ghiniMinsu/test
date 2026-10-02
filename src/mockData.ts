import { MergedRecord, QueryHistory } from './types';

// Seoul 25 districts baseline price per m2 (in 만원)
// average overall: 1,373 만원/m2 (from slide 3: "평균 1,373만원/㎡")
export const DISTRICT_BASELINES: Record<string, { pricePerM2: number; premiumFactor: number }> = {
  '강남구': { pricePerM2: 2450, premiumFactor: 1.8 },
  '서초구': { pricePerM2: 2200, premiumFactor: 1.6 },
  '송파구': { pricePerM2: 1800, premiumFactor: 1.4 },
  '용산구': { pricePerM2: 1750, premiumFactor: 1.35 },
  '성동구': { pricePerM2: 1450, premiumFactor: 1.2 },
  '마포구': { pricePerM2: 1380, premiumFactor: 1.15 },
  '영등포구': { pricePerM2: 1250, premiumFactor: 1.1 },
  '동작구': { pricePerM2: 1200, premiumFactor: 1.05 },
  '광진구': { pricePerM2: 1180, premiumFactor: 1.05 },
  '중구': { pricePerM2: 1150, premiumFactor: 1.0 },
  '양천구': { pricePerM2: 1280, premiumFactor: 1.1 },
  '강동구': { pricePerM2: 1100, premiumFactor: 0.95 },
  '종로구': { pricePerM2: 1050, premiumFactor: 0.95 },
  '서대문구': { pricePerM2: 1020, premiumFactor: 0.9 },
  '동대문구': { pricePerM2: 950, premiumFactor: 0.85 },
  '성북구': { pricePerM2: 920, premiumFactor: 0.82 },
  '은평구': { pricePerM2: 880, premiumFactor: 0.8 },
  '관악구': { pricePerM2: 860, premiumFactor: 0.78 },
  '노원구': { pricePerM2: 820, premiumFactor: 0.75 },
  '구로구': { pricePerM2: 800, premiumFactor: 0.72 },
  '중랑구': { pricePerM2: 740, premiumFactor: 0.68 },
  '강서구': { pricePerM2: 980, premiumFactor: 0.88 },
  '강북구': { pricePerM2: 710, premiumFactor: 0.65 },
  '금천구': { pricePerM2: 730, premiumFactor: 0.66 },
  '도봉구': { pricePerM2: 690, premiumFactor: 0.62 },
};

// Mock raw dataset corresponding to slide 8 (Apartment x RealTransaction x Feature joined)
export const RAW_RECORDS: MergedRecord[] = [
  {
    id: 101,
    apt_name: '아크로리버파크',
    district: '서초구',
    dong: '반포동',
    area_m2: 84,
    floor: 22,
    build_year: 2016,
    deal_id: 2001,
    apt_id: 101,
    price_ten_thousand: 243000, // 24.3 억원
    deal_date: '2026-03-12',
    report_type: '중개거래',
    feat_id: 3001,
    age: 10,
    price_per_m2: 2892,
    subway_grade: '우수',
    grade: 'A',
  },
  {
    id: 102,
    apt_name: '은마아파트',
    district: '강남구',
    dong: '대치동',
    area_m2: 76,
    floor: 12,
    build_year: 1979,
    deal_id: 2002,
    apt_id: 102,
    price_ten_thousand: 195000, // 19.5 억원
    deal_date: '2026-04-05',
    report_type: '중개거래',
    feat_id: 3002,
    age: 47,
    price_per_m2: 2565,
    subway_grade: '우수',
    grade: 'A',
  },
  {
    id: 103,
    apt_name: '래미안 퍼스티지',
    district: '서초구',
    dong: '반포동',
    area_m2: 114,
    floor: 18,
    build_year: 2009,
    deal_id: 2003,
    apt_id: 103,
    price_ten_thousand: 238000,
    deal_date: '2026-02-20',
    report_type: '중개거래',
    feat_id: 3003,
    age: 17,
    price_per_m2: 2087,
    subway_grade: '우수',
    grade: 'A',
  },
  {
    id: 104,
    apt_name: '압구정현대 3차',
    district: '강남구',
    dong: '압구정동',
    area_m2: 82,
    floor: 9,
    build_year: 1976,
    deal_id: 2004,
    apt_id: 104,
    price_ten_thousand: 220000,
    deal_date: '2026-05-10',
    report_type: '직거래',
    feat_id: 3004,
    age: 50,
    price_per_m2: 2682,
    subway_grade: '보통',
    grade: 'A',
  },
  {
    id: 105,
    apt_name: '헬리오시티',
    district: '송파구',
    dong: '가락동',
    area_m2: 84,
    floor: 15,
    build_year: 2018,
    deal_id: 2005,
    apt_id: 105,
    price_ten_thousand: 165000, // 16.5 억원
    deal_date: '2026-05-22',
    report_type: '중개거래',
    feat_id: 3005,
    age: 8,
    price_per_m2: 1964,
    subway_grade: '우수',
    grade: 'B',
  },
  {
    id: 106,
    apt_name: '마포래미안푸르지오',
    district: '마포구',
    dong: '아현동',
    area_m2: 84,
    floor: 14,
    build_year: 2014,
    deal_id: 2006,
    apt_id: 106,
    price_ten_thousand: 148000,
    deal_date: '2026-04-18',
    report_type: '중개거래',
    feat_id: 3006,
    age: 12,
    price_per_m2: 1761,
    subway_grade: '우수',
    grade: 'B',
  },
  {
    id: 107,
    apt_name: '한남더힐',
    district: '용산구',
    dong: '한남동',
    area_m2: 59,
    floor: 5,
    build_year: 2011,
    deal_id: 2007,
    apt_id: 107,
    price_ten_thousand: 242000,
    deal_date: '2026-05-02',
    report_type: '중개거래',
    feat_id: 3007,
    age: 15,
    price_per_m2: 4101,
    subway_grade: '보통',
    grade: 'A',
  },
  {
    id: 108,
    apt_name: 'DMC 파크뷰자이',
    district: '서대문구',
    dong: '남가좌동',
    area_m2: 84,
    floor: 11,
    build_year: 2015,
    deal_id: 2008,
    apt_id: 108,
    price_ten_thousand: 98000, // 9.8 억
    deal_date: '2026-05-15',
    report_type: '중개거래',
    feat_id: 3008,
    age: 11,
    price_per_m2: 1166,
    subway_grade: '보통',
    grade: 'C',
  },
  {
    id: 109,
    apt_name: '신촌그랑자이',
    district: '마포구',
    dong: '대흥동',
    area_m2: 59,
    floor: 16,
    build_year: 2020,
    deal_id: 2009,
    apt_id: 109,
    price_ten_thousand: 125000,
    deal_date: '2026-04-30',
    report_type: '중개거래',
    feat_id: 3009,
    age: 6,
    price_per_m2: 2118,
    subway_grade: '우수',
    grade: 'B',
  },
  {
    id: 110,
    apt_name: '경희궁자이 2단지',
    district: '종로구',
    dong: '홍파동',
    area_m2: 84,
    floor: 10,
    build_year: 2017,
    deal_id: 2010,
    apt_id: 110,
    price_ten_thousand: 155000,
    deal_date: '2026-03-25',
    report_type: '중개거래',
    feat_id: 3010,
    age: 9,
    price_per_m2: 1845,
    subway_grade: '우수',
    grade: 'B',
  },
  {
    id: 111,
    apt_name: '목동신시가지 7단지',
    district: '양천구',
    dong: '목동',
    area_m2: 66,
    floor: 8,
    build_year: 1986,
    deal_id: 2011,
    apt_id: 111,
    price_ten_thousand: 142000,
    deal_date: '2020-05-01',
    report_type: '중개거래',
    feat_id: 3011,
    age: 40,
    price_per_m2: 2151,
    subway_grade: '우수',
    grade: 'B',
  },
  {
    id: 112,
    apt_name: '상계주공 6단지',
    district: '노원구',
    dong: '상계동',
    area_m2: 58,
    floor: 4,
    build_year: 1988,
    deal_id: 2012,
    apt_id: 112,
    price_ten_thousand: 52000, // 5.2 억
    deal_date: '2026-06-02',
    report_type: '중개거래',
    feat_id: 3012,
    age: 38,
    price_per_m2: 896,
    subway_grade: '우수',
    grade: 'D',
  },
  {
    id: 113,
    apt_name: '신도림 동아 1차',
    district: '구로구',
    dong: '신도림동',
    area_m2: 84,
    floor: 15,
    build_year: 1999,
    deal_id: 2013,
    apt_id: 113,
    price_ten_thousand: 88000,
    deal_date: '2026-05-28',
    report_type: '중개거래',
    feat_id: 3013,
    age: 27,
    price_per_m2: 1047,
    subway_grade: '우수',
    grade: 'C',
  },
  {
    id: 114,
    apt_name: '힐스테이트 강동 리버뷰',
    district: '강동구',
    dong: '천호동',
    area_m2: 84,
    floor: 20,
    build_year: 2019,
    deal_id: 2014,
    apt_id: 114,
    price_ten_thousand: 115000,
    deal_date: '2026-05-11',
    report_type: '중개거래',
    feat_id: 3014,
    age: 7,
    price_per_m2: 1369,
    subway_grade: '보통',
    grade: 'C',
  },
  {
    id: 115,
    apt_name: '번동 솔그린',
    district: '강북구',
    dong: '번동',
    area_m2: 59,
    floor: 3,
    build_year: 2002,
    deal_id: 2015,
    apt_id: 115,
    price_ten_thousand: 46000,
    deal_date: '2026-06-01',
    report_type: '중개거래',
    feat_id: 3015,
    age: 24,
    price_per_m2: 779,
    subway_grade: '불량',
    grade: 'D',
  },
  {
    id: 116,
    apt_name: '중계 그린',
    district: '노원구',
    dong: '중계동',
    area_m2: 49,
    floor: 12,
    build_year: 1990,
    deal_id: 2016,
    apt_id: 116,
    price_ten_thousand: 41000,
    deal_date: '2026-04-14',
    report_type: '중개거래',
    feat_id: 3016,
    age: 36,
    price_per_m2: 836,
    subway_grade: '보통',
    grade: 'D',
  },
  {
    id: 117,
    apt_name: '창동 주공 17단지',
    district: '도봉구',
    dong: '창동',
    area_m2: 36,
    floor: 7,
    build_year: 1989,
    deal_id: 2017,
    apt_id: 117,
    price_ten_thousand: 31000,
    deal_date: '2026-06-10',
    report_type: '중개거래',
    feat_id: 3017,
    age: 37,
    price_per_m2: 861,
    subway_grade: '보통',
    grade: 'D',
  },
  {
    id: 118,
    apt_name: '성내 현대하이츠',
    district: '강동구',
    dong: '성내동',
    area_m2: 84,
    floor: 6,
    build_year: 1991,
    deal_id: 2018,
    apt_id: 118,
    price_ten_thousand: 73000,
    deal_date: '2026-05-19',
    report_type: '중개거래',
    feat_id: 3018,
    age: 35,
    price_per_m2: 869,
    subway_grade: '보통',
    grade: 'D',
  },
  {
    id: 119,
    apt_name: 'e편한세상 금호 파크힐스',
    district: '성동구',
    dong: '금호동',
    area_m2: 84,
    floor: 12,
    build_year: 2018,
    deal_id: 2019,
    apt_id: 119,
    price_ten_thousand: 149000,
    deal_date: '2026-05-03',
    report_type: '중개거래',
    feat_id: 3019,
    age: 8,
    price_per_m2: 1773,
    subway_grade: '우수',
    grade: 'B',
  },
  {
    id: 120,
    apt_name: '시흥 베르빌',
    district: '금천구',
    dong: '시흥동',
    area_m2: 84,
    floor: 8,
    build_year: 2004,
    deal_id: 2020,
    apt_id: 120,
    price_ten_thousand: 54000,
    deal_date: '2026-05-25',
    report_type: '중개거래',
    feat_id: 3020,
    age: 22,
    price_per_m2: 642,
    subway_grade: '보통',
    grade: 'D',
  },
];

// Initial mock query history (to populate historical records visually)
export const INITIAL_QUERY_HISTORY: QueryHistory[] = [
  {
    hist_id: 501,
    user_email: 'scv12365@gmail.com',
    apt_name: '대치 센트레빌',
    district: '강남구',
    area_m2: 84,
    floor: 15,
    query_time: '2026-06-15T07:12:10Z',
    query_type: '통합검색',
    predicted_grade: 'A',
    predicted_price_ten_thousand: 215000,
  },
  {
    hist_id: 502,
    user_email: 'scv12365@gmail.com',
    apt_name: '마포 원리빌',
    district: '마포구',
    area_m2: 59,
    floor: 8,
    query_time: '2026-06-15T07:01:25Z',
    query_type: '일반조회',
    predicted_grade: 'C',
    predicted_price_ten_thousand: 83000,
  },
  {
    hist_id: 503,
    user_email: 'testuser@gmail.com',
    apt_name: '신정 신시가지 12단지',
    district: '양천구',
    area_m2: 84,
    floor: 5,
    query_time: '2026-06-14T18:44:00Z',
    query_type: '프리미엄조회',
    predicted_grade: 'B',
    predicted_price_ten_thousand: 126000,
  },
];

// ML Prediction function - acts as the Random Forest surrogate model
export function predictRealScore(
  district: string,
  area: number,
  floor: number,
  buildYear: number
): {
  predictedPrice: number; // 만원
  grade: 'A' | 'B' | 'C' | 'D';
  gradeTitle: string;
  gradeDescription: string;
  computedAge: number;
  computedUnitPrice: number; // 만원/m2
  subwayGrade: '우수' | '보통' | '불량';
  reasons: string[];
} {
  // Sanitize and guarantee safe types / values
  district = district || '강남구';
  area = Math.max(1, Number(area) || 84);
  floor = Math.max(1, Number(floor) || 15);
  buildYear = Math.max(1950, Number(buildYear) || 2015);

  const baselineInfo = DISTRICT_BASELINES[district] || { pricePerM2: 1000, premiumFactor: 1.0 };
  const age = 2026 - buildYear;

  // 1. Calculate price base
  let pricePerM2 = baselineInfo.pricePerM2;

  // 2. Age effect (New vs Old)
  // New premium: age < 5 yrs: +18%, age < 10 yrs: +10%
  // Moderate: age 10-25 yrs: normal
  // Reconstruction potential premium: old but in luxurious district: age > 35 and premiumFactor >= 1.4: +12%
  // Otherwise, standard decay for ordinary districts
  if (age < 5) {
    pricePerM2 *= 1.22;
  } else if (age < 12) {
    pricePerM2 *= 1.10;
  } else if (age > 35 && baselineInfo.premiumFactor >= 1.4) {
    pricePerM2 *= 1.15; // reconstruction expectations
  } else if (age > 20) {
    // decay
    const agePenalty = Math.min(0.25, (age - 20) * 0.008);
    pricePerM2 *= (1 - agePenalty);
  }

  // 3. Floor effect (basement or low vs high)
  // floor 1-3: -8%
  // floor 4-10: normal
  // floor 11-25: +5%
  // floor > 25: +10%
  let floorFactor = 1.0;
  if (floor <= 3) {
    floorFactor = 0.92;
  } else if (floor >= 25) {
    floorFactor = 1.10;
  } else if (floor >= 11) {
    floorFactor = 1.05;
  }

  // 4. Final computed price per m2
  const finalPricePerM2 = Math.round(pricePerM2 * floorFactor);
  let computedPrice = Math.round(finalPricePerM2 * area);

  // Apply a minor scaling penalty or reward for extreme sizes (diminishing return on pure scale)
  if (area > 120) {
    computedPrice *= 0.95;
  } else if (area < 40) {
    computedPrice *= 1.03;
  }

  computedPrice = Math.round(computedPrice);

  // Floor of 7,000 and max of 243,000 as per PDF
  computedPrice = Math.max(7000, Math.min(243000, computedPrice));

  // Computed Unit Price
  const computedUnitPrice = Math.round(computedPrice / area);

  // 5. Determine Grade (using heuristics equivalent to Slide 4 & 11)
  // Ranges: A represents 0.3%, B represents 10.5%, C represents 46.7%, D represents 42.5%
  // A: Exclusive high price & high location (usually > 18억 or exceptional premium)
  // B: High-end (usually > 11.5억 or premium locations)
  // C: Medium-market (usually 6.5억 - 11.5억)
  // D: Budget / Older sub-optimal (< 6.5억)
  let grade: 'A' | 'B' | 'C' | 'D' = 'C';
  let gradeTitle = '투자 적합';
  let gradeDescription = '추가 검토 후 투자 권장';

  if (computedPrice >= 180000 || (computedUnitPrice >= 2300 && baselineInfo.premiumFactor >= 1.5)) {
    grade = 'A';
    gradeTitle = '투자 최적 (Premium)';
    gradeDescription = '최상의 입지와 우수한 자본 수익률 기여 가능';
  } else if (computedPrice >= 115000 || (computedUnitPrice >= 1400 && baselineInfo.premiumFactor >= 1.2)) {
    grade = 'B';
    gradeTitle = '투자 매우 우수';
    gradeDescription = '입지와 년식 대비 안정적인 자산 가치 형성 완료';
  } else if (computedPrice >= 65000) {
    grade = 'C';
    gradeTitle = '투자 일반';
    gradeDescription = '보통 수준의 시장 평균 대비 방어력 보유';
  } else {
    grade = 'D';
    gradeTitle = '보수적 접근';
    gradeDescription = '가치 방어가 제한되어 보수적인 현금 흐름 관점 접근 필요';
  }

  // Subway grade assignment (semi-deterministic based on premium factor)
  let subwayGrade: '우수' | '보통' | '불량' = '보통';
  if (baselineInfo.premiumFactor >= 1.3) {
    subwayGrade = '우수';
  } else if (baselineInfo.premiumFactor <= 0.7) {
    subwayGrade = '불량';
  } else {
    subwayGrade = Math.random() > 0.4 ? '보통' : '우수';
  }

  // 6. Generate precise data-grounded reasons (Slide 11 style)
  const reasons: string[] = [];

  // Age reason
  if (age <= 5) {
    reasons.push(`건물나이 ${age}년 — 신축급 및 주거 선호도 초강력 우수`);
  } else if (age <= 12) {
    reasons.push(`건물나이 ${age}년 — 준신축으로서 양호한 상태 및 소모성 감가 우수`);
  } else if (age > 35 && baselineInfo.premiumFactor >= 1.5) {
    reasons.push(`건물나이 ${age}년 — 재건축 프리미엄과 강남핵심지 상실 불가능 조합`);
  } else {
    reasons.push(`건물나이 ${age}년 — 구축 감가가 주택 담보 비중에 미비 반영`);
  }

  // District premium reason
  if (baselineInfo.premiumFactor >= 1.5) {
    reasons.push(`${district} 입지 — 프리미엄 핵심 지역 및 최고의 수요 수렴 지역`);
  } else if (baselineInfo.premiumFactor >= 1.1) {
    reasons.push(`${district} 입지 — 도심 접근성 우수하며 시세 하방 지지력이 단단한 지역`);
  } else {
    reasons.push(`${district} 입지 — 상대적으로 합리적인 평단가 진입 장벽의 가성비 지역`);
  }

  // Floor reason
  if (floor >= 20) {
    reasons.push(`${floor}층 — 조망권 및 일조량이 뛰어난 로열 초고층 메리트`);
  } else if (floor >= 10) {
    reasons.push(`${floor}층 — 고층 수준의 선호도와 양호한 매수 대기층 포진`);
  } else if (floor >= 4) {
    reasons.push(`${floor}층 — 프라이버시 침해가 없는 무난한 중층 호수`);
  } else {
    reasons.push(`${floor}층 — 다소 저층으로, 고층 아파트 대비 시세 소폭 할인 작용`);
  }

  return {
    predictedPrice: computedPrice,
    grade,
    gradeTitle,
    gradeDescription,
    computedAge: age,
    computedUnitPrice,
    subwayGrade,
    reasons,
  };
}
