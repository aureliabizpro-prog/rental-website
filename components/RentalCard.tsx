"use client";

import React, { useState } from 'react';
import { MapPin, Home, FileCheck, ChevronDown, ChevronUp, Calendar, Coins, AlertTriangle, Sparkles } from 'lucide-react';

// ============================================
// TypeScript 類型定義 - V3/V4 格式
// ============================================
interface LayoutInfo {
  room_size?: string | null;
  overall_layout?: string | null;
  floor_info?: string | null;
  area_ping?: number | null;        // V3新增：坪數
  room_details?: string[] | null;   // V3新增：多房間詳細列表
}

interface RentalDetails {
  address: string | null;
  layout_info: LayoutInfo;
  rights: string;
  cost_notes: string[];
  facilities: string[];
  // restrictions 欄位已在 V3 中移除
}

interface Rental {
  id: string;
  district: string;
  housing_type: string;
  rent_price: string | null;  // V3改為string，支援單一價格、價格區間、null
  title: string;
  summary_notes: string[];
  details: RentalDetails;
  post_date: string;
  source_url: string | null;  // V4: 允許null
}

// ============================================
// 配色系統 - 溫潤灰階 + 警告色
// ============================================
const COLORS = {
  primary: '#4A4A4A',
  secondary: '#6B6B6B',
  light: '#D1D1D1',
  border: '#E5E5E5',
  background: '#FFFFFF',
  text: {
    primary: '#2C2C2C',
    secondary: '#6B6B6B',
    muted: '#9B9B9B',
    warning: '#D97706'
  }
};

// ============================================
// 子元件：標籤（底線式）
// ============================================
interface TagProps {
  children: React.ReactNode;
  emphasized?: boolean;
}

const Tag: React.FC<TagProps> = ({ children, emphasized = false }) => (
  <div className="inline-flex flex-col items-center">
    <span
      className={`${emphasized ? 'text-lg font-bold' : 'text-sm font-medium'}`}
      style={{ color: COLORS.text.primary }}
    >
      {children}
    </span>
    <div
      className="w-full h-0.5 mt-1"
      style={{ backgroundColor: emphasized ? COLORS.primary : COLORS.secondary }}
    />
  </div>
);

// ============================================
// 子元件：資訊列
// ============================================
interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueStyle?: React.CSSProperties;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, valueStyle }) => (
  <div className="flex items-start gap-2 text-sm">
    <div className="flex items-center gap-1.5 min-w-[60px]" style={{ color: COLORS.text.secondary }}>
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    <span style={{ color: COLORS.text.primary, ...valueStyle }}>{value}</span>
  </div>
);

// ============================================
// 子元件：格局資訊折疊區塊
// ============================================
interface LayoutInfoBlockProps {
  layoutInfo: LayoutInfo;
}

const LayoutInfoBlock: React.FC<LayoutInfoBlockProps> = ({ layoutInfo }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 按優先級整理資訊：overall_layout > room_size > area_ping > floor_info > room_details
  const layoutItems = [
    { label: '整屋格局', value: layoutInfo.overall_layout, key: 'overall_layout' },
    { label: '房間坪數', value: layoutInfo.room_size, key: 'room_size' },
    { label: '坪數', value: layoutInfo.area_ping ? `${layoutInfo.area_ping}坪` : null, key: 'area_ping' },
    { label: '樓層', value: layoutInfo.floor_info, key: 'floor_info' },
    { label: '房間詳情', value: layoutInfo.room_details ? layoutInfo.room_details.join('、') : null, key: 'room_details' },
  ].filter(item => item.value); // 只保留有值的項目

  // 如果沒有任何資訊，不顯示這個區塊
  if (layoutItems.length === 0) return null;

  // 只有1項：直接顯示，無收合按鈕
  if (layoutItems.length === 1) {
    return (
      <div className="mt-4">
        <div className="flex items-center gap-2 text-sm font-medium" style={{ color: COLORS.text.secondary }}>
          <Home size={16} />
          <span>格局說明</span>
        </div>
        <div className="mt-2 pl-6 text-sm" style={{ color: COLORS.text.secondary }}>
          {layoutItems[0].value}
        </div>
      </div>
    );
  }

  // 2項以上：顯示最重要的 + 收合按鈕
  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
        style={{ color: COLORS.text.secondary }}
      >
        <Home size={16} />
        <span>格局說明</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {!isExpanded && (
        <div className="mt-2 pl-6 text-sm" style={{ color: COLORS.text.secondary }}>
          {layoutItems[0].value}
        </div>
      )}

      {isExpanded && (
        <div className="mt-2 pl-6 space-y-1 text-sm" style={{ color: COLORS.text.secondary }}>
          {layoutItems.map(item => (
            <div key={item.key}>{item.label}：{item.value}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// 子元件：費用折疊區塊 (cost_notes)
// ============================================
interface CostNotesBlockProps {
  costNotes: string[];
}

const CostNotesBlock: React.FC<CostNotesBlockProps> = ({ costNotes }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (costNotes.length === 0) return null;

  // 只在有明確警告符號時才顯示橘色
  const hasWarning = costNotes.some(note => note.includes('⚠️'));

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
        style={{ color: hasWarning ? COLORS.text.warning : COLORS.text.secondary }}
      >
        <Coins size={16} />
        <span>費用說明</span>
        {hasWarning && <AlertTriangle size={14} />}
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* 收合時：只顯示第一項 */}
      {!isExpanded && (
        <div className="mt-1 pl-6 text-sm" style={{ color: COLORS.text.secondary }}>
          {costNotes[0]}
        </div>
      )}

      {/* 展開時：顯示所有項目 */}
      {isExpanded && (
        <div className="mt-2 pl-6 space-y-1 text-sm" style={{ color: COLORS.text.secondary }}>
          {costNotes.map((note, index) => (
            <div key={index}>{note}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// 子元件：設施列表
// ============================================
interface FacilitiesBlockProps {
  facilities: string[];
}

const FacilitiesBlock: React.FC<FacilitiesBlockProps> = ({ facilities }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (facilities.length === 0) return null;

  const displayCount = 3;
  const hasMore = facilities.length > displayCount;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 text-sm font-medium" style={{ color: COLORS.text.secondary }}>
        <Sparkles size={16} />
        <span>加分配備</span>
      </div>
      <div className="mt-2 pl-6 space-y-1 text-sm" style={{ color: COLORS.text.secondary }}>
        {facilities.slice(0, isExpanded ? facilities.length : displayCount).map((facility, index) => (
          <div key={index}>• {facility}</div>
        ))}
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium hover:opacity-70 transition-opacity mt-1"
            style={{ color: COLORS.secondary }}
          >
            {isExpanded ? '收合 ▲' : `+ 查看另外 ${facilities.length - displayCount} 項 ▼`}
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// 子元件：Summary Notes 展開區塊
// ============================================
interface NotesBlockProps {
  notes: string[];
  title: string;
}

const NotesBlock: React.FC<NotesBlockProps> = ({ notes, title }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 處理每個 note，檢查是否有 [WARNING] 前綴
  const renderNote = (text: string, index: number) => {
    if (text.startsWith('[WARNING]')) {
      const content = text.replace('[WARNING]', '');
      return (
        <span key={index} style={{ color: COLORS.text.warning }}>
          {content}
        </span>
      );
    }
    return <span key={index}>{text}</span>;
  };

  // 合併 title 和 notes
  const allContent = [title, ...notes].filter(Boolean);
  const totalLength = allContent.join('').length;
  const shouldTruncate = totalLength > 100;

  return (
    <div className="relative">
      <div
        className={`text-lg font-bold leading-relaxed ${!isExpanded && shouldTruncate ? 'line-clamp-3' : ''}`}
        style={{ color: COLORS.text.primary }}
      >
        {allContent.map((text, index) => (
          <React.Fragment key={index}>
            {renderNote(text, index)}
            {index < allContent.length - 1 && '、'}
          </React.Fragment>
        ))}
      </div>

      {!isExpanded && shouldTruncate && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
      )}

      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm font-medium hover:opacity-70 transition-opacity"
          style={{ color: COLORS.secondary }}
        >
          {isExpanded ? '收合' : '展開完整描述'}
        </button>
      )}
    </div>
  );
};

// ============================================
// 主元件：租屋卡片
// ============================================
interface RentalCardProps {
  rental: Rental;
}

const RentalCard: React.FC<RentalCardProps> = ({ rental }) => {
  const {
    district,
    housing_type,
    rent_price,
    title,
    summary_notes,
    details,
    post_date,
    source_url
  } = rental;

  // 移除「台北市」或「新北市」前綴，只顯示區名
  const displayDistrict = district
    .replace('台北市', '')
    .replace('新北市', '');

  // 處理租金顯示邏輯
  const formatRentPrice = (price: string | null): string => {
    if (price === null) return '價格未提供';

    // 檢查是否為價格區間（如 "12000~15000"）
    if (price.includes('~')) {
      const [min, max] = price.split('~').map(p => parseInt(p.trim()));
      return `$${min.toLocaleString()}~${max.toLocaleString()}`;
    }

    // 單一價格
    const numPrice = parseInt(price);
    return `$${numPrice.toLocaleString()}`;
  };

  return (
    <div
      className="rounded-xl p-6 transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: COLORS.background,
        border: `1px solid ${COLORS.border}`
      }}
    >
      {/* 標籤區域 - 只有客觀資訊 */}
      <div className="flex items-end gap-6 mb-5">
        <Tag>{displayDistrict}</Tag>
        <Tag>{housing_type}</Tag>
        {rent_price !== null ? (
          <Tag emphasized>{formatRentPrice(rent_price)}</Tag>
        ) : (
          <div className="inline-flex flex-col items-center">
            <span className="text-sm font-medium" style={{ color: COLORS.text.warning }}>
              價格未提供｜點擊原文查看
            </span>
            <div className="w-full h-0.5 mt-1" style={{ backgroundColor: COLORS.text.warning }} />
          </div>
        )}
      </div>

      {/* Notes 區域 */}
      <NotesBlock notes={summary_notes} title={title} />

      {/* 分隔線 */}
      <div className="my-5" style={{ borderTop: `1px solid ${COLORS.light}` }} />

      {/* 詳細資訊 */}
      <div className="space-y-3">
        {/* 詳細地址 */}
        {details.address !== null ? (
          <InfoRow
            icon={<MapPin size={16} />}
            label="詳細地址"
            value={details.address}
          />
        ) : (
          <InfoRow
            icon={<MapPin size={16} />}
            label="詳細地址"
            value="未提供"
            valueStyle={{ color: COLORS.text.muted }}
          />
        )}

        {/* 格局資訊 */}
        {(details.layout_info.room_size || details.layout_info.overall_layout || details.layout_info.floor_info || details.layout_info.area_ping || details.layout_info.room_details) && (
          <LayoutInfoBlock layoutInfo={details.layout_info} />
        )}

        {/* 權利 */}
        <InfoRow
          icon={<FileCheck size={16} />}
          label="權利"
          value={details.rights}
          valueStyle={details.rights === "未說明" ? { color: COLORS.text.muted } : undefined}
        />
      </div>

      {/* 費用折疊區塊 */}
      <CostNotesBlock costNotes={details.cost_notes} />

      {/* 設施列表 */}
      <FacilitiesBlock facilities={details.facilities} />

      {/* 刊登日期 */}
      <div
        className="flex items-center gap-1 mt-4 text-xs"
        style={{ color: COLORS.text.muted }}
      >
        <Calendar size={12} />
        刊登於 {post_date}
      </div>

      {/* CTA 連結 */}
      {source_url && (
        <a
          href={source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 block text-center text-sm font-medium hover:underline"
          style={{ color: '#334155' }}
        >
          查看完整物件資訊 →
        </a>
      )}
    </div>
  );
};

export default RentalCard;
