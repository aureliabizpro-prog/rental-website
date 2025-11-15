"use client";

import React, { useState, useMemo, useEffect } from 'react';
import RentalCard from '@/components/RentalCard';
import PageHeader from '@/components/PageHeader';
import FilterBar from '@/components/FilterBar';

// 暫時直接嵌入資料進行測試
const EMBEDDED_DATA = [
  {
    "id": "2025-11-14-001",
    "district": "台北市南港區",
    "housing_type": "獨立套房",
    "rent": "18800",
    "is_multi_room": false,
    "posted_date": "2025-11-14",
    "summary_notes": "距離文湖線＋板南線雙捷交會首站僅1分鐘、步行30公尺即達雙捷交會「南港展覽館站」、附家具",
    "details": {
      "address": null,
      "layout_info": {
        "room_size": "8坪",
        "overall_layout": "1房1衛"
      },
      "rights": "未說明"
    },
    "fees": {
      "electricity": "台電計費",
      "deposit": "2個月",
      "included": "未說明"
    },
    "url": "https://www.facebook.com/commerce/listing/1374285981079795/?ref=share_attachment&__cft__[0]=AZXTK8zdIqibaFuf9cgN90tk26KRqpctBowEx6RxH2silRIhbklHkgLHxZ-48rhaHZiMQmcQ-qBsQ2vG_3NsOfhxZQ6am9f5_pGiDCCTkGijgbPX7RvoJqv24NrLz7FH6ei6SIcBkhzzfYs54JOGAhY3BHqp4rlCCWiE_SYr1FndN-WWo_goWpT0yh13iAH0JpTqTd5s3cC7Cec_sSLc--ht&__tn__=*WH-R"
  },
  {
    "id": "2025-11-14-002",
    "district": "台北市松山區",
    "housing_type": "雅房",
    "rent": "12800",
    "is_multi_room": true,
    "posted_date": "2025-11-14",
    "summary_notes": "步行6分鐘到南京三民捷運站、有電梯、有陽台",
    "details": {
      "address": null,
      "layout_info": {
        "overall_layout": "4房2衛",
        "floor_info": "4F"
      },
      "rights": "可租補"
    },
    "fees": {
      "electricity": "台電計費",
      "deposit": "2個月",
      "included": "管理費、網路費"
    },
    "url": "https://www.facebook.com/commerce/listing/1809309009696439/?ref=share_attachment&__cft__[0]=AZVcbqjm8hoHnSchFW6jQfvdVMoqWExeXbu7bnkpHJbsHDW19YJct3bf2s9k31a9s6-rdEM45nlQUSe5kgKLoclNhSfqiqibEcd1ua6emgRkqZN_W34xbL0R73PPtQceMSZJ2gAcoYlel1qA2Aw-47alv9E5OLSaVb1d0X1qNwcnFDSBd4r14MH7Ym-23osz9fxmd2koYd4AOyA7xhMmdcGI&__tn__=*WH-R"
  },
  {
    "id": "2025-11-14-003",
    "district": "新北市中和區",
    "housing_type": "獨立套房",
    "rent": "28000",
    "is_multi_room": false,
    "posted_date": "2025-11-14",
    "summary_notes": "有陽台、獨立廚房、瓦斯",
    "details": {
      "address": null,
      "layout_info": {
        "room_size": "25坪",
        "overall_layout": "2房",
        "floor_info": "2F"
      },
      "rights": "未說明"
    },
    "fees": {
      "electricity": "台電計費",
      "deposit": "2個月",
      "included": "管理費"
    },
    "url": "https://www.facebook.com/commerce/listing/1386704826405270/?ref=share_attachment&__cft__[0]=AZWYL6BUTD5jnwG9K3GPvYVc21mQuZBCiQvIcOcvxUxEPLzRDO27CMCoB0A3jDXzjT1QjVMHITRMjU0W59it6_nTkT4mrx9p0zdxGaRAgruyg02TsQXmPrqudh5vdoqIDv6VO7dMGmDEZhUZ4YKLUB_H4ztBKB_AbaOs2uHkr-agTQO_OOeSbCActlGJsYKww7o94l9TQf5TxVlV5U24r6MK&__tn__=*WH-R"
  }
];

export default function Home() {
  // 租屋資料狀態 - 直接使用嵌入的資料
  const [rentals, setRentals] = useState(EMBEDDED_DATA);
  const [loading, setLoading] = useState(false);

  // 篩選狀態管理
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedHousingType, setSelectedHousingType] = useState('');

  // 篩選邏輯
  const filteredRentals = useMemo(() => {
    return rentals.filter((rental: any) => {
      // 區域篩選
      if (selectedDistrict && rental.district !== selectedDistrict) {
        return false;
      }

      // 房型篩選
      if (selectedHousingType && rental.housing_type !== selectedHousingType) {
        return false;
      }

      return true;
    });
  }, [rentals, selectedDistrict, selectedHousingType]);

  // 清除所有篩選
  const handleClearFilters = () => {
    setSelectedDistrict('');
    setSelectedHousingType('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* 頁面表頭 */}
      <PageHeader totalListings={filteredRentals.length} />

      {/* 篩選列 */}
      <FilterBar
        selectedDistrict={selectedDistrict}
        selectedHousingType={selectedHousingType}
        onDistrictChange={setSelectedDistrict}
        onHousingTypeChange={setSelectedHousingType}
        onClearFilters={handleClearFilters}
      />

      {/* 租屋卡片網格 */}
      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-lg font-medium text-gray-500">載入中...</p>
          </div>
        ) : filteredRentals.length > 0 ? (
          filteredRentals.map((rental: any) => (
            <RentalCard key={rental.id} rental={rental} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg font-medium text-gray-500">
              找不到符合條件的物件
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 text-sm font-medium underline"
              style={{ color: '#334155' }}
            >
              清除篩選條件
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
