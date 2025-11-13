"use client";

import React from 'react';
import { X } from 'lucide-react';

// ============================================
// TypeScript 類型定義
// ============================================
interface FilterBarProps {
  selectedDistrict: string;
  selectedHousingType: string;
  onDistrictChange: (value: string) => void;
  onHousingTypeChange: (value: string) => void;
  onClearFilters: () => void;
}

// ============================================
// 配色系統 - 延續溫潤灰階
// ============================================
const COLORS = {
  text: {
    primary: '#2C2C2C',
    secondary: '#6B6B6B',
    cta: '#334155',       // CTA 連結顏色（板岩藍）
  },
  border: '#E5E5E5',
  background: '#FFFFFF',
};

// ============================================
// 資料：大台北地區行政區
// ============================================
const DISTRICTS = [
  // 台北市
  { value: '中正區', label: '中正區', city: '台北市' },
  { value: '大同區', label: '大同區', city: '台北市' },
  { value: '中山區', label: '中山區', city: '台北市' },
  { value: '松山區', label: '松山區', city: '台北市' },
  { value: '大安區', label: '大安區', city: '台北市' },
  { value: '萬華區', label: '萬華區', city: '台北市' },
  { value: '信義區', label: '信義區', city: '台北市' },
  { value: '士林區', label: '士林區', city: '台北市' },
  { value: '北投區', label: '北投區', city: '台北市' },
  { value: '內湖區', label: '內湖區', city: '台北市' },
  { value: '南港區', label: '南港區', city: '台北市' },
  { value: '文山區', label: '文山區', city: '台北市' },
  // 新北市
  { value: '板橋區', label: '板橋區', city: '新北市' },
  { value: '三重區', label: '三重區', city: '新北市' },
  { value: '中和區', label: '中和區', city: '新北市' },
  { value: '永和區', label: '永和區', city: '新北市' },
  { value: '新莊區', label: '新莊區', city: '新北市' },
  { value: '新店區', label: '新店區', city: '新北市' },
  { value: '樹林區', label: '樹林區', city: '新北市' },
  { value: '鶯歌區', label: '鶯歌區', city: '新北市' },
  { value: '三峽區', label: '三峽區', city: '新北市' },
  { value: '淡水區', label: '淡水區', city: '新北市' },
  { value: '汐止區', label: '汐止區', city: '新北市' },
  { value: '瑞芳區', label: '瑞芳區', city: '新北市' },
  { value: '土城區', label: '土城區', city: '新北市' },
  { value: '蘆洲區', label: '蘆洲區', city: '新北市' },
  { value: '五股區', label: '五股區', city: '新北市' },
  { value: '泰山區', label: '泰山區', city: '新北市' },
  { value: '林口區', label: '林口區', city: '新北市' },
  { value: '深坑區', label: '深坑區', city: '新北市' },
  { value: '石碇區', label: '石碇區', city: '新北市' },
  { value: '坪林區', label: '坪林區', city: '新北市' },
  { value: '三芝區', label: '三芝區', city: '新北市' },
  { value: '石門區', label: '石門區', city: '新北市' },
  { value: '八里區', label: '八里區', city: '新北市' },
  { value: '平溪區', label: '平溪區', city: '新北市' },
  { value: '雙溪區', label: '雙溪區', city: '新北市' },
  { value: '貢寮區', label: '貢寮區', city: '新北市' },
  { value: '金山區', label: '金山區', city: '新北市' },
  { value: '萬里區', label: '萬里區', city: '新北市' },
  { value: '烏來區', label: '烏來區', city: '新北市' },
];

// ============================================
// 資料：房型選項
// ============================================
const HOUSING_TYPES = [
  { value: '雅房', label: '雅房' },
  { value: '分租套房', label: '分租套房' },
  { value: '獨立套房', label: '獨立套房' },
  { value: '雅套混合', label: '雅套混合' },
];

// ============================================
// 主元件：篩選列
// ============================================
const FilterBar: React.FC<FilterBarProps> = ({
  selectedDistrict,
  selectedHousingType,
  onDistrictChange,
  onHousingTypeChange,
  onClearFilters,
}) => {
  const hasActiveFilters = selectedDistrict !== '' || selectedHousingType !== '';

  return (
    <div className="w-full bg-white border-b" style={{ borderColor: COLORS.border }}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="space-y-3">
          {/* 篩選列：兩個下拉選單並排 */}
          <div className="flex items-center gap-3">
            {/* 區域下拉選單 */}
            <div className="flex-1">
              <select
                value={selectedDistrict}
                onChange={(e) => onDistrictChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{
                  borderColor: COLORS.border,
                  color: selectedDistrict ? COLORS.text.primary : COLORS.text.secondary,
                  backgroundColor: COLORS.background,
                }}
              >
                <option value="">所有區域</option>
                <optgroup label="台北市">
                  {DISTRICTS.filter(d => d.city === '台北市').map(district => (
                    <option key={district.value} value={district.value}>
                      {district.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="新北市">
                  {DISTRICTS.filter(d => d.city === '新北市').map(district => (
                    <option key={district.value} value={district.value}>
                      {district.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* 房型下拉選單 */}
            <div className="flex-1">
              <select
                value={selectedHousingType}
                onChange={(e) => onHousingTypeChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{
                  borderColor: COLORS.border,
                  color: selectedHousingType ? COLORS.text.primary : COLORS.text.secondary,
                  backgroundColor: COLORS.background,
                }}
              >
                <option value="">所有房型</option>
                {HOUSING_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 清除篩選連結：單獨一行，居中顯示 */}
          {hasActiveFilters && (
            <div className="flex justify-center">
              <button
                onClick={onClearFilters}
                className="flex items-center gap-1.5 text-sm font-medium hover:underline transition-all"
                style={{ color: COLORS.text.cta }}
              >
                <X size={16} />
                清除篩選
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
