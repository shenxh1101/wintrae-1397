import type { ColorScheme } from '@/types';

export const defaultColorSchemes: ColorScheme[] = [
  {
    primary: '#8B7355',
    secondary: '#9CAF88',
    accent: '#D4A574',
    background: '#FAF8F5',
    text: '#5A4A37',
  },
  {
    primary: '#6B8E6B',
    secondary: '#A8D5BA',
    accent: '#E8C4C4',
    background: '#F5F8F2',
    text: '#3D4F3D',
  },
  {
    primary: '#A67C52',
    secondary: '#C9B1D6',
    accent: '#D4A574',
    background: '#FDFCFB',
    text: '#6B4423',
  },
  {
    primary: '#5D6D7E',
    secondary: '#B8D8D0',
    accent: '#E8B4A0',
    background: '#F8FAFA',
    text: '#34495E',
  },
  {
    primary: '#C17F59',
    secondary: '#F5CBA7',
    accent: '#CD853F',
    background: '#FFFAF5',
    text: '#8B4513',
  },
  {
    primary: '#7D669E',
    secondary: '#D4C1E3',
    accent: '#F0B8B8',
    background: '#FAF8FC',
    text: '#5B497A',
  },
];

export function adjustColorBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function hexToRgb(color: string): { r: number; g: number; b: number } {
  const hex = color.replace('#', '');
  return {
    r: parseInt(hex.substr(0, 2), 16),
    g: parseInt(hex.substr(2, 2), 16),
    b: parseInt(hex.substr(4, 2), 16),
  };
}

export function getContrastColor(color: string): string {
  const { r, g, b } = hexToRgb(color);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
