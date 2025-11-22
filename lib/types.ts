// ============================================
// V6 Compatible 後端資料型別（原始格式）
// ============================================
export interface BackendRentalV6Compatible {
  id: string;
  district: string;
  housing_type: string;
  rent_price: string | null;
  title: string;
  summary_notes: string[];
  address: string | null;
  room_size: string | null;
  overall_layout: string | null;
  floor_info: string | null;
  area_ping: number | null;
  room_details: string[] | null;
  rights: string[];
  cost_notes: string[];
  facilities: string[];
  post_date: string;
  source_url: string;
}

// ============================================
// V6 前端資料型別定義（內部使用）
// ============================================
export interface FrontendRental {
  id: string;
  district: string;
  housing_type: string;
  rent: number;              // 保證 > 0
  summary_notes: string[];   // V6 Compatible: 字串陣列，每項為獨立的精煉資訊
  address: string;           // 扁平化
  rights: string[];          // 陣列格式
  cost_notes: string[];
  facilities: string[];
  layout_info: string;       // 單一字串
  posted_date: string;
  url: string;
}

// 驗證後的安全型別
export interface ValidatedRental extends FrontendRental {
  // 所有欄位都經過驗證和預設值處理
}
