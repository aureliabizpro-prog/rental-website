// ============================================
// 顯示工具函數
// ============================================

/**
 * 顯示內容或友善的預設文字
 * @param value - 要顯示的值
 * @param fallbackText - 當值為 "未提供" 時顯示的文字（預設："屋主未填寫"）
 * @returns 處理後的顯示文字
 */
export function displayOrFallback(
  value: string | undefined | null,
  fallbackText: string = "屋主未填寫"
): string {
  if (!value || value.trim() === "" || value === "未提供") {
    return fallbackText;
  }
  return value;
}

/**
 * 檢查值是否為空或 "未提供"
 * @param value - 要檢查的值
 * @returns 是否為空
 */
export function isEmpty(value: string | undefined | null): boolean {
  return !value || value.trim() === "" || value === "未提供";
}
