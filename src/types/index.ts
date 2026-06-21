export type TemplateType = 'circle' | 'square' | 'rectangle' | 'special';
export type TemplateStyle = 'minimal' | 'vintage' | 'fresh' | 'luxury' | 'cute';
export type ElementType = 'text' | 'icon' | 'image' | 'shape';
export type PaperSize = 'A4' | 'A5' | '6inch' | 'custom';

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface LabelElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  lineHeight?: number;
  
  iconName?: string;
  iconColor?: string;
  iconStrokeWidth?: number;
  
  shapeType?: 'rect' | 'circle' | 'line';
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  borderRadius?: number;
  
  imageSrc?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
}

export interface Ingredient {
  id: string;
  name: string;
  order: number;
  isAllergen: boolean;
  percentage?: string;
}

export interface LabelTemplate {
  id: string;
  name: string;
  type: TemplateType;
  style: TemplateStyle;
  defaultWidth: number;
  defaultHeight: number;
  defaultElements: LabelElement[];
  defaultColors: ColorScheme;
}

export interface LabelData {
  id: string;
  templateId: string;
  name: string;
  weight: string;
  ingredients: Ingredient[];
  usage: string;
  shelfLife: string;
  batchNumber: string;
  allergyWarning: string;
  width: number;
  height: number;
  elements: LabelElement[];
  colors: ColorScheme;
  ingredientsListMode: 'inline' | 'list';
  createdAt: number;
  updatedAt: number;
}

export interface PrintSettings {
  paperSize: PaperSize;
  paperWidth: number;
  paperHeight: number;
  labelsPerRow: number;
  labelsPerColumn: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  gapX: number;
  gapY: number;
  showCropMarks: boolean;
  copies: number;
}

export interface Draft {
  id: string;
  name: string;
  thumbnail: string;
  labelData: LabelData;
  createdAt: number;
  updatedAt: number;
}

export interface IconItem {
  name: string;
  category: string;
  keywords: string[];
}
