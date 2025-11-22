"use client";

import React, { useState, useMemo } from 'react';
import RentalCard from '@/components/RentalCard';
import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';
import FilterBar from '@/components/FilterBar';
import rentalsDataRaw from '@/public/data/rentals.json';
import { sanitizeRentals } from '@/lib/validator';
import { FrontendRental } from '@/lib/types';

export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedHousingType, setSelectedHousingType] = useState('');

  // 1. 載入並驗證所有資料
  const allRentals = useMemo(() => {
    // 暫時使用 any 處理 V5 -> V6 過渡期
    return sanitizeRentals(rentalsDataRaw as any);
  }, []);

  // 2. 計算「24 小時內」的物件
  const recentRentals = useMemo(() => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return allRentals.filter(rental => {
      // 如果 posted_date 為空或無法解析，不算在「本日新增」
      if (!rental.posted_date || rental.posted_date.trim() === '') return false;

      try {
        const postedDate = new Date(rental.posted_date);
        // 檢查日期是否有效
        if (isNaN(postedDate.getTime())) return false;
        return postedDate >= oneDayAgo;
      } catch {
        return false;
      }
    });
  }, [allRentals]);

  // 3. 應用地區/房型篩選到「24 小時內」資料
  const filteredRecentRentals = useMemo(() => {
    return recentRentals
      .filter(rental => {
        if (selectedDistrict && !rental.district.includes(selectedDistrict)) {
          return false;
        }
        if (selectedHousingType && rental.housing_type !== selectedHousingType) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = a.posted_date || '';
        const dateB = b.posted_date || '';
        return dateB.localeCompare(dateA);
      });
  }, [recentRentals, selectedDistrict, selectedHousingType]);

  // 4. 應用地區/房型篩選到「所有」資料（fallback）
  const filteredAllRentals = useMemo(() => {
    return allRentals
      .filter(rental => {
        if (selectedDistrict && !rental.district.includes(selectedDistrict)) {
          return false;
        }
        if (selectedHousingType && rental.housing_type !== selectedHousingType) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = a.posted_date || '';
        const dateB = b.posted_date || '';
        return dateB.localeCompare(dateA);
      });
  }, [allRentals, selectedDistrict, selectedHousingType]);

  // 5. 決定實際顯示哪些卡片
  const displayRentals = filteredRecentRentals.length > 0
    ? filteredRecentRentals
    : filteredAllRentals;

  // 6. 是否顯示 fallback 提示訊息
  const showFallbackMessage = filteredRecentRentals.length === 0 && filteredAllRentals.length > 0;

  // 7. 生成 fallback 訊息（根據篩選條件動態調整）
  const getFallbackMessage = () => {
    const filters = [];
    if (selectedDistrict) filters.push(selectedDistrict);
    if (selectedHousingType) filters.push(selectedHousingType);

    const filterText = filters.length > 0 ? `符合「${filters.join(' + ')}」的` : '合格';
    return `目前沒有符合 24 小時內條件的物件，以下為所有時間範圍內${filterText}物件（共 ${displayRentals.length} 筆）。`;
  };

  // 清除篩選
  const handleClearFilters = () => {
    setSelectedDistrict('');
    setSelectedHousingType('');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F5F5' }}>
      <PageHeader totalListings={filteredRecentRentals.length} />

      <FilterBar
        selectedDistrict={selectedDistrict}
        selectedHousingType={selectedHousingType}
        onDistrictChange={setSelectedDistrict}
        onHousingTypeChange={setSelectedHousingType}
        onClearFilters={handleClearFilters}
      />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        {/* Fallback 提示訊息 */}
        {showFallbackMessage && (
          <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-800">
              {getFallbackMessage()}
            </p>
          </div>
        )}

        {/* 卡片列表 */}
        {displayRentals.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            沒有符合條件的租屋資訊
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {displayRentals.map(rental => (
              <RentalCard key={rental.id} rental={rental} />
            ))}
          </div>
        )}
      </main>

      <PageFooter />
    </div>
  );
}
