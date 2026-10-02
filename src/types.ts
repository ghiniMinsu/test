export interface Apartment {
  id: number;
  apt_name: string;
  district: string;
  dong: string;
  area_m2: number;
  floor: number;
  build_year: number;
}

export interface RealTransaction {
  deal_id: number;
  apt_id: number;
  price_ten_thousand: number; // in ten thousand KRW (만원)
  deal_date: string;
  report_type: string; // 신고구분
}

export interface DerivedFeature {
  feat_id: number;
  apt_id: number;
  age: number;
  price_per_m2: number; // 만원/m2
  subway_grade: '우수' | '보통' | '불량'; // 역세권 등급
}

export interface MergedRecord extends Apartment, RealTransaction, DerivedFeature {
  grade: 'A' | 'B' | 'C' | 'D';
}

export interface UserAccount {
  user_id: number;
  email: string;
  join_date: string;
  membership_level: string;
}

export interface QueryHistory {
  hist_id: number;
  user_email: string;
  apt_name: string;
  district: string;
  area_m2: number;
  floor: number;
  query_time: string;
  query_type: string;
  predicted_grade: 'A' | 'B' | 'C' | 'D';
  predicted_price_ten_thousand: number;
}

export interface PerformanceStats {
  accuracy: number;
  grade_confidence: number;
  mae_ten_thousand: number;
  r2: number;
}

export interface FeatureImportance {
  feature_name: string;
  importance: number; // 0.0 - 1.0
}
