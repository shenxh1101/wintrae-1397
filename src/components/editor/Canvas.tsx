import { useRef, useMemo, useState, useEffect } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useLabelStore } from '@/store/labelStore';
import CanvasElement from './CanvasElement';
import { cmToPx } from '@/utils/units';

interface CanvasProps {
  canvasRef: React.RefObject<HTMLDivElement>;
}

export default function Canvas({ canvasRef }: CanvasProps) {
  const currentLabel = useLabelStore((state) => state.currentLabel);
  const updateElement = useLabelStore((state) => state.updateElement);
  const selectElement = useLabelStore((state) => state.selectElement);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      setContainerSize({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const { canvasWidth, canvasHeight, scale } = useMemo(() => {
    if (!currentLabel) return { canvasWidth: 0, canvasHeight: 0, scale: 1 };
    if (containerSize.width === 0 || containerSize.height === 0) {
      const labelWidthPx = cmToPx(currentLabel.width);
      const labelHeightPx = cmToPx(currentLabel.height);
      return {
        canvasWidth: labelWidthPx,
        canvasHeight: labelHeightPx,
        scale: 1,
      };
    }

    const containerWidth = containerSize.width - 80;
    const containerHeight = containerSize.height - 80;

    const labelWidthPx = cmToPx(currentLabel.width);
    const labelHeightPx = cmToPx(currentLabel.height);

    const widthRatio = containerWidth / labelWidthPx;
    const heightRatio = containerHeight / labelHeightPx;
    const scale = Math.min(widthRatio, heightRatio, 1.5);

    return {
      canvasWidth: labelWidthPx * scale,
      canvasHeight: labelHeightPx * scale,
      scale,
    };
  }, [currentLabel, currentLabel?.width, currentLabel?.height, containerSize.width, containerSize.height]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const elementId = active.id as string;

    const element = currentLabel?.elements.find((el) => el.id === elementId);
    if (!element || !currentLabel) return;

    const deltaXPercent = (delta.x / canvasWidth) * 100;
    const deltaYPercent = (delta.y / canvasHeight) * 100;

    const newX = Math.max(0, Math.min(100 - element.width, element.x + deltaXPercent));
    const newY = Math.max(0, Math.min(100 - element.height, element.y + deltaYPercent));

    updateElement(elementId, { x: newX, y: newY });
  };

  const handleCanvasClick = () => {
    selectElement(null);
  };

  if (!currentLabel) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-48 h-48 rounded-2xl bg-cream-200" />
          <div className="text-sm text-brown-400">正在加载模板...</div>
        </div>
      </div>
    );
  }

  const sortedElements = [...currentLabel.elements].sort((a, b) => a.zIndex - b.zIndex);

  const isCircle = currentLabel.templateId.includes('circle');

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center p-10 overflow-auto bg-cream-100/50"
      onClick={handleCanvasClick}
    >
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div
          ref={canvasRef}
          className="relative drop-shadow-label will-change-transform"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: currentLabel.colors.background,
            borderRadius: isCircle ? '50%' : '8px',
            border: `2px solid ${currentLabel.colors.primary}`,
            overflow: 'hidden',
          }}
        >
          {sortedElements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              scale={scale}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
            />
          ))}
        </div>
      </DndContext>

      {/* 尺寸标注 */}
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm text-brown-500 shadow-soft">
        {currentLabel.width} × {currentLabel.height} cm
      </div>
    </div>
  );
}
