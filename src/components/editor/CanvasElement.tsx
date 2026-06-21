import React, { useRef, useState, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import * as LucideIcons from 'lucide-react';
import type { LabelElement } from '@/types';
import { useLabelStore } from '@/store/labelStore';
import { replacePlaceholders, createPlaceholderContext, hasPlaceholders } from '@/utils/placeholders';

interface CanvasElementProps {
  element: LabelElement;
  scale: number;
  canvasWidth: number;
  canvasHeight: number;
}

export default function CanvasElement({ element, scale, canvasWidth, canvasHeight }: CanvasElementProps) {
  const selectedElementId = useLabelStore((state) => state.selectedElementId);
  const selectElement = useLabelStore((state) => state.selectElement);
  const updateElement = useLabelStore((state) => state.updateElement);
  const currentLabel = useLabelStore((state) => state.currentLabel);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(element.content || '');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const isSelected = selectedElementId === element.id;
  const elementRef = useRef<HTMLDivElement>(null);

  const displayedText = useMemo(() => {
    if (element.type !== 'text') return element.content;
    if (!currentLabel) return element.content;
    const context = createPlaceholderContext(currentLabel);
    return replacePlaceholders(element.content || '', context);
  }, [element.content, element.type, currentLabel]);

  const elementHasPlaceholders = useMemo(() => {
    return element.type === 'text' && hasPlaceholders(element.content || '');
  }, [element.content, element.type]);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id,
    disabled: element.locked || isEditing,
  });

  const width = (element.width / 100) * canvasWidth;
  const height = (element.height / 100) * canvasHeight;
  const left = (element.x / 100) * canvasWidth - width / 2;
  const top = (element.y / 100) * canvasHeight - height / 2;

  const style: React.CSSProperties = {
    position: 'absolute',
    left,
    top,
    width,
    height,
    transform: `${CSS.Translate.toString(transform)} rotate(${element.rotation}deg)`,
    transformOrigin: 'center center',
    zIndex: element.zIndex,
    opacity: element.visible ? 1 : 0.5,
    cursor: element.locked ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
    transition: isDragging ? 'none' : 'box-shadow 0.15s',
  };

  if (isDragging) {
    style.opacity = 0.8;
  }

  if (isSelected && !isDragging) {
    style.boxShadow = '0 0 0 2px #8B7355, 0 0 0 4px rgba(139, 115, 85, 0.2)';
  }

  const handleDoubleClick = () => {
    if (element.type === 'text' && !element.locked) {
      setIsEditing(true);
      setEditText(element.content || '');
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      updateElement(element.id, { content: editText });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(element.content || '');
    }
  };

  const renderContent = () => {
    if (isEditing && element.type === 'text') {
      const isMultiLine = (element.content?.length || 0) > 30;
      const commonProps = {
        ref: inputRef as React.RefObject<HTMLInputElement & HTMLTextAreaElement>,
        value: editText,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEditText(e.target.value),
        onBlur: handleBlur,
        onKeyDown: handleKeyDown,
        style: {
          width: '100%',
          height: '100%',
          border: '1px dashed #8B7355',
          borderRadius: '4px',
          padding: '4px',
          fontSize: element.fontSize ? element.fontSize * scale : 14,
          fontFamily: getFontFamily(element.fontFamily),
          fontWeight: element.fontWeight || 400,
          fontStyle: element.fontStyle || 'normal',
          textAlign: element.textAlign || 'center',
          color: element.color,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          lineHeight: element.lineHeight || 1.5,
          outline: 'none',
          resize: 'none',
        } as React.CSSProperties,
      };

      return isMultiLine ? (
        <textarea {...commonProps} rows={3} />
      ) : (
        <input {...commonProps} type="text" />
      );
    }

    switch (element.type) {
      case 'text':
        return (
          <div
            style={{
              fontSize: element.fontSize ? element.fontSize * scale : 14,
              fontFamily: getFontFamily(element.fontFamily),
              fontWeight: element.fontWeight || 400,
              fontStyle: element.fontStyle || 'normal',
              textAlign: element.textAlign || 'center',
              color: element.color,
              lineHeight: element.lineHeight || 1.5,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: element.textAlign === 'left' ? 'flex-start' : element.textAlign === 'right' ? 'flex-end' : 'center',
              overflow: 'hidden',
              wordBreak: 'break-word',
              padding: elementHasPlaceholders && isSelected ? '2px 4px' : 0,
              outline: elementHasPlaceholders && isSelected ? '1px dashed #C9B8A8' : 'none',
              borderRadius: '2px',
            }}
          >
            {displayedText}
          </div>
        );

      case 'icon':
        const IconComponent = (LucideIcons as unknown as Record<string, React.FC<{ size?: number; color?: string; strokeWidth?: number }>>)[element.iconName || 'Leaf'];
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {IconComponent && (
              <IconComponent
                size={Math.min(width, height) * 0.8}
                color={element.iconColor}
                strokeWidth={element.iconStrokeWidth || 2}
              />
            )}
          </div>
        );

      case 'shape':
        return renderShape(element);

      case 'image':
        return (
          <img
            src={element.imageSrc}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: element.objectFit || 'cover',
              borderRadius: element.borderRadius || 0,
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        if (node) {
          (elementRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        if (!isEditing) {
          selectElement(element.id);
        }
      }}
      onDoubleClick={handleDoubleClick}
      {...listeners}
      {...attributes}
      className="select-none"
    >
      {renderContent()}
    </div>
  );
}

function renderShape(element: LabelElement): React.ReactNode {
  const { shapeType, fillColor, strokeColor, strokeWidth, borderRadius } = element;

  const commonStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: fillColor || 'transparent',
    border: strokeWidth ? `${strokeWidth}px solid ${strokeColor}` : 'none',
    borderRadius: shapeType === 'circle' ? '50%' : borderRadius || 0,
  };

  if (shapeType === 'line') {
    return (
      <div
        style={{
          width: '100%',
          height: strokeWidth || 1,
          backgroundColor: strokeColor,
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
    );
  }

  return <div style={commonStyle} />;
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
