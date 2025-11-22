// ============================================
// V6 前端資料驗證器（含後端資料轉換層）
// ============================================

import { BackendRentalV6Compatible, FrontendRental, ValidatedRental } from './types';

// 允許的房型
const ALLOWED_HOUSING_TYPES = [
  "雅房",
  "分租套房",
  "獨立套房",
  "雅套混合",
];

// 允許的權利關鍵詞
const ALLOWED_RIGHTS = [
  "可寵",
  "可租補",
  "可報稅",
  "可設籍",
  "限女",
  "限女性",
  "限男",
  "限男性",
];

/**
 * 驗證並清理房型
 */
function sanitizeHousingType(htype: string): string {
  if (!htype || !ALLOWED_HOUSING_TYPES.includes(htype)) {
    return "未提供";
  }
  return htype;
}

/**
 * 驗證並清理權利陣列
 */
function sanitizeRights(rights: string[]): string[] {
  if (!Array.isArray(rights)) return [];
  return rights.filter(r =>
    typeof r === 'string' &&
    r.trim().length > 0 &&
    ALLOWED_RIGHTS.includes(r.trim())
  );
}

/**
 * 驗證並清理費用說明
 */
function sanitizeCostNotes(notes: string[]): string[] {
  if (!Array.isArray(notes)) return [];
  return notes.filter(n => typeof n === 'string' && n.trim().length > 0);
}

/**
 * 驗證並清理設施列表
 */
function sanitizeFacilities(facilities: string[]): string[] {
  if (!Array.isArray(facilities)) return [];
  return facilities.filter(f => typeof f === 'string' && f.trim().length > 0);
}

/**
 * 從 summary_notes 陣列中移除與 facilities 重複的內容
 *
 * 策略：將 facilities 的關鍵詞提取出來，如果 summary_notes 某項
 * 只包含這些關鍵詞且無其他有意義內容，則過濾掉該項
 */
function deduplicateSummaryNotes(summaryNotes: string[], facilities: string[]): string[] {
  if (!summaryNotes || !Array.isArray(summaryNotes) || facilities.length === 0) {
    return summaryNotes || [];
  }

  // 建立 facilities 關鍵詞集合
  const facilityKeywords = new Set<string>();
  facilities.forEach(facility => {
    facilityKeywords.add(facility);
    // 也加入常見的簡寫
    if (facility.includes('洗衣機')) facilityKeywords.add('洗衣機');
    if (facility.includes('獨立洗衣機')) facilityKeywords.add('獨洗');
    if (facility.includes('電梯')) facilityKeywords.add('電梯');
    if (facility.includes('陽台')) facilityKeywords.add('陽台');
    if (facility.includes('垃圾代收')) facilityKeywords.add('垃圾代收');
  });

  // 過濾 summary_notes 陣列中的重複項
  return summaryNotes.filter(note => {
    const trimmed = note.trim();
    if (!trimmed) return false;

    // 檢查這一項是否只是在列舉 facility
    // 簡單策略：如果這項包含任何 facility 關鍵詞且長度很短（< 15字），視為重複
    for (const keyword of facilityKeywords) {
      if (trimmed.includes(keyword) && trimmed.length < 15) {
        return false; // 過濾掉
      }
    }

    return true;
  });
}

/**
 * 轉換後端 V6 Compatible 格式為前端格式
 */
function convertBackendToFrontend(backend: BackendRentalV6Compatible): FrontendRental | null {
  // 1. 解析租金：rent_price 為字串，需要轉為數字
  let rent = 0;
  if (backend.rent_price && backend.rent_price !== "未提供") {
    const priceStr = backend.rent_price.trim();

    // 處理多房價格（如 "A房$12600, B房$13800, D房$13200"）
    if (priceStr.includes('$') && priceStr.includes(',')) {
      // 提取所有價格數字
      const matches = priceStr.match(/\$\s*(\d+)/g);
      if (matches && matches.length > 0) {
        const prices = matches.map(m => parseInt(m.replace(/\D/g, ''), 10));
        rent = Math.min(...prices); // 取最低價
      }
    }
    // 處理範圍價格（如 "6000~10000" 或 "6000-10000"）
    else if (priceStr.includes('~') || priceStr.includes('-')) {
      const parts = priceStr.split(/[~-]/);
      // 取第一個數字（最小值）
      const firstPart = parts[0].replace(/[^0-9]/g, '');
      rent = parseInt(firstPart, 10) || 0;
    } else {
      // 單一價格
      const rentStr = priceStr.replace(/[^0-9]/g, '');
      rent = parseInt(rentStr, 10) || 0;
    }
  }

  // 如果租金無效，過濾掉
  if (!rent || rent <= 0) {
    return null;
  }

  // 2. 構建 layout_info：合併 overall_layout 和其他格局相關資訊
  let layout_info = backend.overall_layout || "";
  if (backend.room_details && Array.isArray(backend.room_details) && backend.room_details.length > 0) {
    const details = backend.room_details.join('、');
    layout_info = layout_info ? `${layout_info} (${details})` : details;
  }
  if (!layout_info) layout_info = "未提供";

  // 3. 返回前端格式
  return {
    id: backend.id,
    district: backend.district || "未提供",
    housing_type: backend.housing_type || "未提供",
    rent,
    summary_notes: Array.isArray(backend.summary_notes) ? backend.summary_notes : [],
    address: backend.address || "未提供",
    rights: Array.isArray(backend.rights) ? backend.rights : [],
    cost_notes: Array.isArray(backend.cost_notes) ? backend.cost_notes : [],
    facilities: Array.isArray(backend.facilities) ? backend.facilities : [],
    layout_info,
    posted_date: backend.post_date || "",
    url: backend.source_url || ""
  };
}

/**
 * 主驗證函數：驗證並清理單筆租屋資料
 */
export function sanitizeRental(rental: FrontendRental): ValidatedRental | null {
  // 1. 驗證必要欄位
  if (!rental.id || typeof rental.rent !== 'number' || rental.rent <= 0) {
    // 不合法的資料，直接過濾掉
    return null;
  }

  // 2. 清理各欄位
  const cleanedRights = sanitizeRights(rental.rights);
  const cleanedFacilities = sanitizeFacilities(rental.facilities);
  const cleanedSummaryNotes = deduplicateSummaryNotes(
    rental.summary_notes || [],
    cleanedFacilities
  );

  return {
    id: rental.id,
    district: rental.district || "未提供",
    housing_type: sanitizeHousingType(rental.housing_type),
    rent: rental.rent,
    summary_notes: cleanedSummaryNotes,
    address: rental.address || "未提供",
    rights: cleanedRights,
    cost_notes: sanitizeCostNotes(rental.cost_notes),
    facilities: cleanedFacilities,
    layout_info: rental.layout_info || "未提供",
    posted_date: rental.posted_date || "",
    url: rental.url || "",
  };
}

/**
 * 批量驗證：過濾並清理整個資料陣列
 * 支援後端 V6 Compatible 格式的自動轉換
 */
export function sanitizeRentals(rentals: (FrontendRental | BackendRentalV6Compatible)[]): ValidatedRental[] {
  if (!Array.isArray(rentals)) return [];

  return rentals
    .map(rental => {
      // 檢查是否為後端格式（有 rent_price 欄位）
      if ('rent_price' in rental) {
        const converted = convertBackendToFrontend(rental as BackendRentalV6Compatible);
        return converted ? sanitizeRental(converted) : null;
      }
      // 否則當作前端格式處理
      return sanitizeRental(rental as FrontendRental);
    })
    .filter((r): r is ValidatedRental => r !== null);
}
