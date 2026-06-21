const DPI = 96;
const MM_TO_CM = 0.1;
const CM_TO_MM = 10;
const INCH_TO_CM = 2.54;

export function cmToPx(cm: number): number {
  return (cm / INCH_TO_CM) * DPI;
}

export function pxToCm(px: number): number {
  return (px / DPI) * INCH_TO_CM;
}

export function mmToPx(mm: number): number {
  return cmToPx(mm * MM_TO_CM);
}

export function pxToMm(px: number): number {
  return pxToCm(px) * CM_TO_MM;
}

export function getPaperDimensions(size: string): { width: number; height: number } {
  switch (size) {
    case 'A4':
      return { width: 210, height: 297 };
    case 'A5':
      return { width: 148, height: 210 };
    case '6inch':
      return { width: 102, height: 152 };
    default:
      return { width: 210, height: 297 };
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
