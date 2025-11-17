"use client";

import React from 'react';

// ============================================
// 配色系統
// ============================================
const COLORS = {
  text: {
    primary: '#2C2C2C',
    secondary: '#6B6B6B',
    muted: '#9B9B9B',
  },
  border: '#E5E5E5',
};

// ============================================
// 主元件：頁面底部
// ============================================
const PageFooter: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t py-8 px-6 mt-12" style={{ borderColor: COLORS.border }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center md:text-left">

          {/* 左側：關於本站 */}
          <div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: COLORS.text.primary }}>
              關於本站
            </h3>
            <p className="text-xs sm:text-sm mb-1" style={{ color: COLORS.text.secondary }}>
              由 <a
                href="https://www.threads.com/@housemate_tw"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
                style={{ color: COLORS.text.primary }}
              >
                好室友
              </a> 團隊每日整理
            </p>
            <p className="text-xs sm:text-sm" style={{ color: COLORS.text.secondary }}>
              彙整大台北 FB 租屋社團最新物件
            </p>
          </div>

          {/* 右側：聯絡我們 */}
          <div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: COLORS.text.primary }}>
              聯絡我們
            </h3>
            <a
              href="https://www.threads.com/@housemate_tw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm hover:underline inline-flex items-center gap-1"
              style={{ color: COLORS.text.secondary }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.018-5.11.893-6.54 2.602-1.387 1.66-2.083 4.005-2.108 7.024v.008c.024 3.015.723 5.353 2.108 7.014 1.43 1.707 3.63 2.582 6.54 2.6 3.737-.02 6.27-1.715 7.745-5.184l2.04.569c-1.651 4.08-4.935 6.117-9.785 6.137z"/>
              </svg>
              @housemate_tw
            </a>
          </div>

        </div>

        {/* 版權聲明 */}
        <div className="mt-6 pt-4 border-t text-center text-xs" style={{ borderColor: COLORS.border, color: COLORS.text.muted }}>
          © {new Date().getFullYear()} 好室友 HouseMate. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
