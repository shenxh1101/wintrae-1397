import React from 'react';
import type { LabelData, LabelElement } from '@/types';
import { cmToPx } from '@/utils/units';
import * as Icons from 'lucide-react';

interface SingleLabelProps {
  labelData: LabelData;
  scale?: number;
  showBorder?: boolean;
}

function renderElement(element: LabelElement, colors: LabelData['colors'], scale: number) {
  if (!element.visible) return null;

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${cmToPx(element.x) * scale}px`,
    top: `${cmToPx(element.y) * scale}px`,
    width: `${cmToPx(element.width) * scale}px`,
    height: `${cmToPx(element.height) * scale}px`,
    transform: `rotate(${element.rotation}deg)`,
    zIndex: element.zIndex,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (element.type === 'text') {
    return (
      <div
        key={element.id}
        style={{
          ...baseStyle,
          fontSize: `${(element.fontSize || 12) * scale}px`,
          fontFamily: element.fontFamily || 'Noto Sans SC',
          fontWeight: element.fontWeight || 400,
          fontStyle: element.fontStyle || 'normal',
          textAlign: element.textAlign || 'center',
          color: element.color || colors.text,
          lineHeight: element.lineHeight || 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {element.content}
      </div>
    );
  }

  if (element.type === 'icon') {
    const IconComponent = (Icons as any)[element.iconName || 'HelpCircle'] || Icons.HelpCircle;
    return (
      <div key={element.id} style={baseStyle}>
        <IconComponent
          style={{
            width: '100%',
            height: '100%',
            color: element.iconColor || colors.primary,
            strokeWidth: element.strokeWidth || 2,
          }}
        />
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
            height: `${(element.strokeWidth || 1) * scale}px`,
            backgroundColor: element.strokeColor || colors.primary,
            top: `${cmToPx(element.y + element.height / 2) * scale}px`,
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
  const widthPx = cmToPx(labelData.width) * scale;
  const heightPx = cmToPx(labelData.height) * scale;

  const isCircle = labelData.templateId.includes('circle') || labelData.templateId.includes('round');

  return (
    <div
      className="relative"
      style={{
        width: `${widthPx}px`,
        height: `${heightPx}px`,
        backgroundColor: labelData.colors.background,
        borderRadius: isCircle ? '50%' : '4px',
        overflow: 'hidden',
        border: showBorder ? '1px dashed #9CA3AF' : 'none',
      }}
    >
      {labelData.elements
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((element) => renderElement(element, labelData.colors, scale))}
    </div>
  );
}
