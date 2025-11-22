"use client";

import React, { useState } from 'react';
import { MapPin, Home, FileCheck, ChevronDown, ChevronUp, Calendar, Coins, AlertTriangle, Sparkles } from 'lucide-react';
import { ValidatedRental } from '@/lib/types';
import { displayOrFallback, isEmpty } from '@/lib/displayUtils';

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
// 子元件：格局資訊區塊
// ============================================
interface LayoutInfoBlockProps {
  layoutInfo: string;
}

const LayoutInfoBlock: React.FC<LayoutInfoBlockProps> = ({ layoutInfo }) => {
  // 使用 isEmpty 檢查是否應該隱藏
  if (isEmpty(layoutInfo)) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
        <Home size={16} />
        <span>格局說明</span>
      </div>
      <div className="pl-6 text-sm" style={{ color: COLORS.text.secondary }}>
        {layoutInfo}
      </div>
    </div>
  );
};

// ============================================
// 子元件：權利標籤區塊
// ============================================
interface RightsTagsBlockProps {
  rights: string[];
}

const RightsTagsBlock: React.FC<RightsTagsBlockProps> = ({ rights }) => {
  if (!rights || rights.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
        <FileCheck size={16} />
        <span>權利</span>
      </div>
      <div className="flex flex-wrap gap-2 pl-6">
        {rights.map((right, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: '#F3F4F6',
              color: COLORS.text.primary,
              border: `1px solid ${COLORS.border}`
            }}
          >
            {right}
          </span>
        ))}
      </div>
    </div>
  );
};

// ============================================
// 子元件：費用折疊區塊
// ============================================
interface CostNotesBlockProps {
  costNotes: string[];
}

const CostNotesBlock: React.FC<CostNotesBlockProps> = ({ costNotes }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (costNotes.length === 0) return null;

  // 檢查是否有警告符號
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
      <div className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
        <Sparkles size={16} />
        <span>加分配備</span>
      </div>
      <div className="pl-6 space-y-1 text-sm" style={{ color: COLORS.text.secondary }}>
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
// 子元件：Summary Notes - V6 Compatible（合併顯示）
// ============================================
interface NotesBlockProps {
  notes: string[];
}

const NotesBlock: React.FC<NotesBlockProps> = ({ notes }) => {
  if (!notes || !Array.isArray(notes) || notes.length === 0) return null;

  // 過濾空字串
  const validNotes = notes.filter(note => note && note.trim().length > 0);

  if (validNotes.length === 0) return null;

  // 處理 [WARNING] 前綴並合併成一句話
  const renderCombinedNotes = () => {
    const segments: JSX.Element[] = [];

    validNotes.forEach((note, index) => {
      const isWarning = note.startsWith('[WARNING]');
      const content = isWarning ? note.replace('[WARNING]', '').trim() : note;

      segments.push(
        <span
          key={index}
          style={{
            color: isWarning ? COLORS.text.warning : COLORS.text.primary,
            fontWeight: isWarning ? 'bold' : 'inherit'
          }}
        >
          {content}
        </span>
      );

      // 添加分隔符（最後一項不加）
      if (index < validNotes.length - 1) {
        segments.push(<span key={`sep-${index}`}>，</span>);
      }
    });

    return segments;
  };

  return (
    <div className="text-lg font-bold leading-relaxed" style={{ color: COLORS.text.primary }}>
      {renderCombinedNotes()}
    </div>
  );
};

// ============================================
// 主元件：租屋卡片
// ============================================
interface RentalCardProps {
  rental: ValidatedRental;
}

const RentalCard: React.FC<RentalCardProps> = ({ rental }) => {
  const {
    district,
    housing_type,
    rent,
    summary_notes,
    address,
    rights,
    cost_notes,
    facilities,
    layout_info,
    posted_date,
    url
  } = rental;

  // 移除「台北市」或「新北市」前綴，只顯示區名
  const displayDistrict = district
    .replace('台北市', '')
    .replace('新北市', '');

  // 格式化租金（保證 rent > 0）
  const formattedRent = `$${rent.toLocaleString()}`;

  return (
    <div
      className="rounded-xl p-6 transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: COLORS.background,
        border: `1px solid ${COLORS.border}`
      }}
    >
      {/* 標籤區域 - 區域、房型、租金 */}
      <div className="flex items-end gap-6 mb-5">
        <Tag>{displayDistrict}</Tag>
        <Tag>{housing_type}</Tag>
        <Tag emphasized>{formattedRent}</Tag>
      </div>

      {/* Notes 區域 */}
      <NotesBlock notes={summary_notes} />

      {/* 分隔線 */}
      <div className="my-5" style={{ borderTop: `1px solid ${COLORS.light}` }} />

      {/* 詳細地址 */}
      <div className="space-y-3">
        <InfoRow
          icon={<MapPin size={16} />}
          label="詳細地址"
          value={displayOrFallback(address)}
          valueStyle={isEmpty(address) ? { color: COLORS.text.muted } : undefined}
        />
      </div>

      {/* 格局資訊 - 獨立區塊 */}
      <LayoutInfoBlock layoutInfo={layout_info} />

      {/* 權利標籤 - 獨立區塊 */}
      <RightsTagsBlock rights={rights} />

      {/* 費用說明 - 獨立區塊 */}
      <CostNotesBlock costNotes={cost_notes} />

      {/* 設施列表 - 獨立區塊 */}
      <FacilitiesBlock facilities={facilities} />

      {/* 刊登日期 */}
      {posted_date && (
        <div
          className="flex items-center gap-1 mt-4 text-xs"
          style={{ color: COLORS.text.muted }}
        >
          <Calendar size={12} />
          刊登於 {posted_date}
        </div>
      )}

      {/* CTA 連結 */}
      {url && (
        <a
          href={url}
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
