import type { LabelTemplate, LabelElement, TemplateType, TemplateStyle } from '@/types';
import { generateId } from './units';

function createTextElement(
  content: string,
  x: number,
  y: number,
  width: number,
  height: number,
  options: Partial<LabelElement> = {}
): LabelElement {
  return {
    id: generateId(),
    type: 'text',
    x,
    y,
    width,
    height,
    rotation: 0,
    zIndex: 1,
    locked: false,
    visible: true,
    content,
    fontSize: 14,
    fontFamily: 'serif',
    fontWeight: 400,
    fontStyle: 'normal',
    textAlign: 'center',
    color: '#5A4A37',
    lineHeight: 1.5,
    ...options,
  };
}

function createIconElement(
  iconName: string,
  x: number,
  y: number,
  width: number,
  height: number,
  options: Partial<LabelElement> = {}
): LabelElement {
  return {
    id: generateId(),
    type: 'icon',
    x,
    y,
    width,
    height,
    rotation: 0,
    zIndex: 1,
    locked: false,
    visible: true,
    iconName,
    iconColor: '#8B7355',
    strokeWidth: 2,
    ...options,
  };
}

function createShapeElement(
  shapeType: 'rect' | 'circle' | 'line',
  x: number,
  y: number,
  width: number,
  height: number,
  options: Partial<LabelElement> = {}
): LabelElement {
  return {
    id: generateId(),
    type: 'shape',
    x,
    y,
    width,
    height,
    rotation: 0,
    zIndex: 0,
    locked: false,
    visible: true,
    shapeType,
    fillColor: 'transparent',
    strokeColor: '#8B7355',
    strokeWidth: 2,
    borderRadius: 0,
    ...options,
  };
}

export const labelTemplates: LabelTemplate[] = [
  {
    id: 'circle-minimal-5cm',
    name: '简约圆形',
    type: 'circle',
    style: 'minimal',
    defaultWidth: 5,
    defaultHeight: 5,
    defaultColors: {
      primary: '#8B7355',
      secondary: '#9CAF88',
      accent: '#D4A574',
      background: '#FAF8F5',
      text: '#5A4A37',
    },
    defaultElements: [
      createShapeElement('circle', 0, 0, 100, 100, {
        fillColor: '#FAF8F5',
        strokeColor: '#8B7355',
        strokeWidth: 2,
        zIndex: 0,
      }),
      createTextElement('{{皂名}}', 50, 25, 80, 15, {
        fontSize: 18,
        fontWeight: 700,
        fontFamily: 'serif',
        color: '#5A4A37',
        zIndex: 2,
      }),
      createIconElement('Leaf', 50, 45, 12, 12, {
        iconColor: '#9CAF88',
        zIndex: 2,
      }),
      createTextElement('{{重量}}', 50, 62, 60, 10, {
        fontSize: 10,
        color: '#8B7355',
        zIndex: 2,
      }),
      createTextElement('成分：{{成分}}', 50, 75, 80, 20, {
        fontSize: 8,
        color: '#6F5B44',
        zIndex: 2,
      }),
    ],
  },
  {
    id: 'circle-vintage-6cm',
    name: '复古花边圆',
    type: 'circle',
    style: 'vintage',
    defaultWidth: 6,
    defaultHeight: 6,
    defaultColors: {
      primary: '#A67C52',
      secondary: '#C9B1D6',
      accent: '#D4A574',
      background: '#FDFCFB',
      text: '#6B4423',
    },
    defaultElements: [
      createShapeElement('circle', 0, 0, 100, 100, {
        fillColor: '#FDFCFB',
        strokeColor: '#A67C52',
        strokeWidth: 3,
        zIndex: 0,
      }),
      createShapeElement('circle', 5, 5, 90, 90, {
        fillColor: 'transparent',
        strokeColor: '#D4A574',
        strokeWidth: 1,
        zIndex: 1,
      }),
      createTextElement('{{皂名}}', 50, 22, 80, 18, {
        fontSize: 20,
        fontWeight: 700,
        fontFamily: 'handwritten',
        color: '#6B4423',
        zIndex: 2,
      }),
      createIconElement('Sparkles', 50, 42, 10, 10, {
        iconColor: '#C9B1D6',
        zIndex: 2,
      }),
      createTextElement('{{重量}}', 50, 58, 60, 10, {
        fontSize: 11,
        color: '#A67C52',
        fontStyle: 'italic',
        zIndex: 2,
      }),
      createTextElement('{{成分}}', 50, 72, 80, 22, {
        fontSize: 9,
        color: '#8B6914',
        zIndex: 2,
      }),
    ],
  },
  {
    id: 'square-fresh-8cm',
    name: '清新方卡',
    type: 'square',
    style: 'fresh',
    defaultWidth: 8,
    defaultHeight: 8,
    defaultColors: {
      primary: '#6B8E6B',
      secondary: '#A8D5BA',
      accent: '#E8C4C4',
      background: '#F5F8F2',
      text: '#3D4F3D',
    },
    defaultElements: [
      createShapeElement('rect', 0, 0, 100, 100, {
        fillColor: '#F5F8F2',
        strokeColor: '#6B8E6B',
        strokeWidth: 2,
        borderRadius: 8,
        zIndex: 0,
      }),
      createIconElement('TreeDeciduous', 50, 15, 15, 15, {
        iconColor: '#6B8E6B',
        zIndex: 2,
      }),
      createTextElement('{{皂名}}', 50, 32, 80, 16, {
        fontSize: 18,
        fontWeight: 700,
        fontFamily: 'serif',
        color: '#3D4F3D',
        zIndex: 2,
      }),
      createTextElement('{{重量}}', 50, 48, 60, 10, {
        fontSize: 11,
        color: '#6B8E6B',
        zIndex: 2,
      }),
      createShapeElement('line', 10, 58, 80, 1, {
        strokeColor: '#A8D5BA',
        strokeWidth: 1,
        zIndex: 1,
      }),
      createTextElement('【成分】{{成分}}', 50, 65, 80, 12, {
        fontSize: 9,
        color: '#4A634A',
        textAlign: 'left',
        zIndex: 2,
      }),
      createTextElement('【用法】{{使用方法}}', 50, 78, 80, 12, {
        fontSize: 9,
        color: '#4A634A',
        textAlign: 'left',
        zIndex: 2,
      }),
    ],
  },
  {
    id: 'rectangle-luxury-a6',
    name: '奢华说明卡',
    type: 'rectangle',
    style: 'luxury',
    defaultWidth: 10.5,
    defaultHeight: 14.8,
    defaultColors: {
      primary: '#5D6D7E',
      secondary: '#B8D8D0',
      accent: '#E8B4A0',
      background: '#F8FAFA',
      text: '#34495E',
    },
    defaultElements: [
      createShapeElement('rect', 0, 0, 100, 100, {
        fillColor: '#F8FAFA',
        strokeColor: '#5D6D7E',
        strokeWidth: 3,
        borderRadius: 4,
        zIndex: 0,
      }),
      createShapeElement('rect', 5, 5, 90, 90, {
        fillColor: 'transparent',
        strokeColor: '#B8D8D0',
        strokeWidth: 1,
        borderRadius: 2,
        zIndex: 1,
      }),
      createIconElement('Gem', 50, 10, 12, 12, {
        iconColor: '#5D6D7E',
        zIndex: 2,
      }),
      createTextElement('{{皂名}}', 50, 22, 80, 20, {
        fontSize: 24,
        fontWeight: 700,
        fontFamily: 'serif',
        color: '#34495E',
        zIndex: 2,
      }),
      createTextElement('Handcrafted Soap', 50, 35, 80, 10, {
        fontSize: 10,
        fontStyle: 'italic',
        color: '#5D6D7E',
        zIndex: 2,
      }),
      createTextElement('净含量：{{重量}}', 50, 45, 80, 10, {
        fontSize: 11,
        color: '#34495E',
        zIndex: 2,
      }),
      createShapeElement('line', 15, 53, 70, 1, {
        strokeColor: '#E8B4A0',
        strokeWidth: 2,
        zIndex: 1,
      }),
      createTextElement('成 分', 50, 58, 80, 10, {
        fontSize: 12,
        fontWeight: 600,
        color: '#5D6D7E',
        zIndex: 2,
      }),
      createTextElement('{{成分}}', 50, 68, 80, 15, {
        fontSize: 9,
        color: '#34495E',
        lineHeight: 1.8,
        zIndex: 2,
      }),
      createTextElement('使用方法：{{使用方法}}', 50, 80, 80, 10, {
        fontSize: 9,
        color: '#34495E',
        zIndex: 2,
      }),
      createTextElement('保质期：{{保存期限}}', 50, 88, 80, 10, {
        fontSize: 9,
        color: '#34495E',
        zIndex: 2,
      }),
    ],
  },
  {
    id: 'circle-cute-4cm',
    name: '可爱小圆',
    type: 'circle',
    style: 'cute',
    defaultWidth: 4,
    defaultHeight: 4,
    defaultColors: {
      primary: '#C17F59',
      secondary: '#F5CBA7',
      accent: '#CD853F',
      background: '#FFFAF5',
      text: '#8B4513',
    },
    defaultElements: [
      createShapeElement('circle', 0, 0, 100, 100, {
        fillColor: '#FFFAF5',
        strokeColor: '#C17F59',
        strokeWidth: 2,
        zIndex: 0,
      }),
      createIconElement('Heart', 50, 18, 10, 10, {
        iconColor: '#E8B4A0',
        zIndex: 2,
      }),
      createTextElement('{{皂名}}', 50, 32, 80, 16, {
        fontSize: 16,
        fontWeight: 700,
        fontFamily: 'handwritten',
        color: '#8B4513',
        zIndex: 2,
      }),
      createTextElement('{{重量}}', 50, 48, 60, 10, {
        fontSize: 10,
        color: '#C17F59',
        zIndex: 2,
      }),
      createIconElement('Star', 25, 70, 8, 8, {
        iconColor: '#F5CBA7',
        zIndex: 2,
      }),
      createIconElement('Star', 50, 72, 8, 8, {
        iconColor: '#CD853F',
        zIndex: 2,
      }),
      createIconElement('Star', 75, 70, 8, 8, {
        iconColor: '#F5CBA7',
        zIndex: 2,
      }),
    ],
  },
  {
    id: 'rectangle-minimal-a7',
    name: '极简长条',
    type: 'rectangle',
    style: 'minimal',
    defaultWidth: 7.4,
    defaultHeight: 10.5,
    defaultColors: {
      primary: '#7D669E',
      secondary: '#D4C1E3',
      accent: '#F0B8B8',
      background: '#FAF8FC',
      text: '#5B497A',
    },
    defaultElements: [
      createShapeElement('rect', 0, 0, 100, 100, {
        fillColor: '#FAF8FC',
        strokeColor: 'transparent',
        strokeWidth: 0,
        zIndex: 0,
      }),
      createShapeElement('rect', 0, 0, 8, 100, {
        fillColor: '#D4C1E3',
        strokeColor: 'transparent',
        strokeWidth: 0,
        zIndex: 0,
      }),
      createTextElement('{{皂名}}', 58, 18, 75, 18, {
        fontSize: 20,
        fontWeight: 700,
        fontFamily: 'serif',
        color: '#5B497A',
        textAlign: 'left',
        zIndex: 2,
      }),
      createTextElement('{{重量}}', 58, 35, 75, 10, {
        fontSize: 11,
        color: '#7D669E',
        textAlign: 'left',
        zIndex: 2,
      }),
      createShapeElement('line', 15, 45, 80, 1, {
        strokeColor: '#D4C1E3',
        strokeWidth: 1,
        zIndex: 1,
      }),
      createTextElement('成分：{{成分}}', 58, 52, 75, 15, {
        fontSize: 9,
        color: '#5B497A',
        textAlign: 'left',
        lineHeight: 1.8,
        zIndex: 2,
      }),
      createTextElement('用法：{{使用方法}}', 58, 68, 75, 10, {
        fontSize: 9,
        color: '#5B497A',
        textAlign: 'left',
        zIndex: 2,
      }),
      createTextElement('保质期：{{保存期限}}', 58, 78, 75, 10, {
        fontSize: 9,
        color: '#5B497A',
        textAlign: 'left',
        zIndex: 2,
      }),
      createTextElement('批次：{{批次编号}}', 58, 88, 75, 10, {
        fontSize: 9,
        color: '#7D669E',
        textAlign: 'left',
        zIndex: 2,
      }),
    ],
  },
];

export function getTemplateById(id: string): LabelTemplate | undefined {
  return labelTemplates.find(t => t.id === id);
}

export function getTemplatesByType(type: TemplateType | 'all'): LabelTemplate[] {
  if (type === 'all') return labelTemplates;
  return labelTemplates.filter(t => t.type === type);
}

export function getTemplatesByStyle(style: TemplateStyle | 'all'): LabelTemplate[] {
  if (style === 'all') return labelTemplates;
  return labelTemplates.filter(t => t.style === style);
}
