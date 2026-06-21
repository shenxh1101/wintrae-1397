import React, { useMemo } from 'react';
import type { LabelData, LabelElement } from '@/types';
import { cmToPx } from '@/utils/units';
import * as Icons from 'lucide-react';
import { replacePlaceholders, createPlaceholderContext } from '@/utils/placeholders';

interface SingleLabelProps {
  labelData: LabelData;
  scale?: number;
  showBorder?: boolean;
}

function getFontFamily(fontFamily?: string): string {
  switch (fontFamily) {
    case 'serif':
      return '"Noto Serif SC", Georgia, serif';
    case 'handwritten':
      return '"Ma Shan Zheng", cursive';
    default:
      return '"Noto Sans SC", system-ui, sans-serif';
  }
}

function renderElement(
  element: LabelElement,
  colors: LabelData['colors'],
  scale: number,
  canvasWidthPx: number,
  canvasHeightPx: number,
  placeholderContext: ReturnType<typeof createPlaceholderContext>
) {
  if (!element.visible) return null;

  const left = (element.x / 100) * canvasWidthPx;
  const top = (element.y / 100) * canvasHeightPx;
  const width = (element.width / 100) * canvasWidthPx;
  const height = (element.height / 100) * canvasHeightPx;

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left,
    top,
    width,
    height,
    transform: `rotate(${element.rotation}deg)`,
    transformOrigin: 'center center',
    zIndex: element.zIndex,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  if (element.type === 'text') {
    const displayText = replacePlaceholders(element.content || '', placeholderContext);
    return (
      <div
        key={element.id}
        style={{
          ...baseStyle,
          fontSize: `${(element.fontSize || 12) * scale}px`,
          fontFamily: getFontFamily(element.fontFamily),
          fontWeight: element.fontWeight || 400,
          fontStyle: element.fontStyle || 'normal',
          textAlign: element.textAlign || 'center',
          color: element.color || colors.text,
          lineHeight: element.lineHeight || 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          justifyContent: element.textAlign === 'left' ? 'flex-start' : element.textAlign === 'right' ? 'flex-end' : 'center',
          padding: '0 2px',
          boxSizing: 'border-box',
        }}
      >
        {displayText}
      </div>
    );
  }

  if (element.type === 'icon') {
    const IconComponent = (Icons as unknown as Record<string, React.FC<{ size?: number; color?: string; strokeWidth?: number }>>)[element.iconName || 'Leaf'];
    return (
      <div key={element.id} style={{ ...baseStyle, overflow: 'visible' }}>
        {IconComponent && (
          <IconComponent
            size={Math.min(width, height) * 0.8}
            color={element.iconColor || colors.primary}
            strokeWidth={element.iconStrokeWidth || 2}
          />
        )}
      </div>
    );
  }

  if (element.type === 'shape') {
    if (element.shapeType === 'circle') {
      return (
        <div
          key={element.id}
          style={{
            ...baseStyle,
            backgroundColor: element.fillColor || 'transparent',
            border: element.strokeWidth ? `${element.strokeWidth * scale}px solid ${element.strokeColor || colors.primary}` : 'none',
            borderRadius: '50%',
            overflow: 'visible',
          }}
        />
      );
    }
    if (element.shapeType === 'rect') {
      return (
        <div
          key={element.id}
          style={{
            ...baseStyle,
            backgroundColor: element.fillColor || 'transparent',
            border: element.strokeWidth ? `${element.strokeWidth * scale}px solid ${element.strokeColor || colors.primary}` : 'none',
            borderRadius: `${(element.borderRadius || 0) * scale}px`,
            overflow: 'visible',
          }}
        />
      );
    }
    if (element.shapeType === 'line') {
      return (
        <div
          key={element.id}
          style={{
            ...baseStyle,
            height: `${Math.max(1, (element.strokeWidth || 1) * scale)}px`,
            backgroundColor: element.strokeColor || colors.primary,
            top: `${top + height / 2 - Math.max(1, (element.strokeWidth || 1) * scale) / 2}px`,
            overflow: 'visible',
          }}
        />
      );
    }
  }

  if (element.type === 'image' && element.imageSrc) {
    return (
      <div key={element.id} style={baseStyle}>
        <img
          src={element.imageSrc}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: element.objectFit || 'cover',
          }}
          draggable={false}
        />
      </div>
    );
  }

  return null;
}

export default function SingleLabel({ labelData, scale = 1, showBorder = false }: SingleLabelProps) {
  const canvasWidthPx = cmToPx(labelData.width) * scale;
  const canvasHeightPx = cmToPx(labelData.height) * scale;

  const isCircle = labelData.templateId.includes('circle') || labelData.templateId.includes('round');

  const placeholderContext = useMemo(() => {
    return createPlaceholderContext(labelData);
  }, [labelData]);

  return (
    <div
      className="relative"
      style={{
        width: `${canvasWidthPx}px`,
        height: `${canvasHeightPx}px`,
        backgroundColor: labelData.colors.background,
        borderRadius: isCircle ? '50%' : '4px',
        overflow: 'hidden',
        border: showBorder ? '1px dashed #9CA3AF' : 'none',
      }}
    >
      {labelData.elements
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((element) => renderElement(element, labelData.colors, scale, canvasWidthPx, canvasHeightPx, placeholderContext))}
    </div>
  );
}
