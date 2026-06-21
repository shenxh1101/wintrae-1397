import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { LabelData, PrintSettings } from '@/types';
import { getPaperDimensions, mmToPx } from './units';

export async function exportAsImage(
  element: HTMLElement,
  options: {
    format?: 'png' | 'jpeg';
    quality?: number;
    scale?: number;
    filename?: string;
  } = {}
): Promise<void> {
  const {
    format = 'png',
    quality = 0.95,
    scale = 2,
    filename = 'label',
  } = options;

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });

  const link = document.createElement('a');
  link.download = `${filename}.${format}`;
  link.href = canvas.toDataURL(`image/${format}`, quality);
  link.click();
}

export async function exportAsPDF(
  elements: HTMLElement[],
  printSettings: PrintSettings,
  filename: string = 'labels'
): Promise<void> {
  const { width: paperWidth, height: paperHeight } = printSettings.paperSize === 'custom'
    ? { width: printSettings.paperWidth, height: printSettings.paperHeight }
    : getPaperDimensions(printSettings.paperSize);

  const pdf = new jsPDF({
    orientation: paperHeight > paperWidth ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [paperWidth, paperHeight],
  });

  const pageWidthPx = mmToPx(paperWidth);
  const pageHeightPx = mmToPx(paperHeight);

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FFFFFF',
      logging: false,
      width: pageWidthPx,
      height: pageHeightPx,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      pdf.addPage([paperWidth, paperHeight]);
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, paperWidth, paperHeight);
  }

  pdf.save(`${filename}.pdf`);
}

export async function generateThumbnail(element: HTMLElement): Promise<string> {
  const canvas = await html2canvas(element, {
    scale: 0.5,
    useCORS: true,
    backgroundColor: '#FAF8F5',
    logging: false,
  });
  return canvas.toDataURL('image/jpeg', 0.7);
}

export async function createLabelCanvas(
  labelData: LabelData,
  scale: number = 2
): Promise<HTMLCanvasElement> {
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = `${labelData.width * 37.8 * scale}px`;
  tempDiv.style.height = `${labelData.height * 37.8 * scale}px`;
  document.body.appendChild(tempDiv);

  try {
    const canvas = await html2canvas(tempDiv, {
      scale,
      useCORS: true,
      backgroundColor: labelData.colors.background,
      logging: false,
    });
    return canvas;
  } finally {
    document.body.removeChild(tempDiv);
  }
}

export function downloadFile(data: string, filename: string, type: string): void {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function printLabels(): void {
  window.print();
}
