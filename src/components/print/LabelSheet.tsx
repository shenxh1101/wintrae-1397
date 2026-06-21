import React, { useRef } from 'react';
import { useLabelStore } from '@/store/labelStore';
import SingleLabel from './SingleLabel';
import { mmToPx } from '@/utils/units';
import { Scissors } from 'lucide-react';

interface LabelSheetProps {
  scale?: number;
  showCropMarks?: boolean;
}

export default function LabelSheet({ scale = 1, showCropMarks }: LabelSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const currentLabel = useLabelStore((state) => state.currentLabel);
  const printSettings = useLabelStore((state) => state.printSettings);

  if (!currentLabel) return null;

  const {
    paperWidth,
    paperHeight,
    labelsPerRow,
    labelsPerColumn,
    marginTop,
    marginLeft,
    gapX,
    gapY,
    showCropMarks: settingsShowCropMarks,
  } = printSettings;

  const displayCropMarks = showCropMarks ?? settingsShowCropMarks;

  const paperWidthPx = mmToPx(paperWidth) * scale;
  const paperHeightPx = mmToPx(paperHeight) * scale;

  const labelWidthMm = currentLabel.width * 10;
  const labelHeightMm = currentLabel.height * 10;

  const marginTopPx = mmToPx(marginTop) * scale;
  const marginLeftPx = mmToPx(marginLeft) * scale;
  const gapXPx = mmToPx(gapX) * scale;
  const gapYPx = mmToPx(gapY) * scale;
  const labelWidthPx = mmToPx(labelWidthMm) * scale;
  const labelHeightPx = mmToPx(labelHeightMm) * scale;

  const renderCropMarks = () => {
    if (!displayCropMarks) return null;

    const marks = [];
    const markLength = mmToPx(5) * scale;
    const markWidth = Math.max(1, scale);

    for (let row = 0; row <= labelsPerColumn; row++) {
      for (let col = 0; col <= labelsPerRow; col++) {
        const x = marginLeftPx + col * (labelWidthPx + gapXPx);
        const y = marginTopPx + row * (labelHeightPx + gapYPx);

        if (col < labelsPerRow && row < labelsPerColumn) {
          marks.push(
            <React.Fragment key={`tl-${row}-${col}`}>
              <div
                style={{
                  position: 'absolute',
                  left: `${x - markLength}px`,
                  top: `${y}px`,
                  width: `${markLength}px`,
                  height: `${markWidth}px`,
                  backgroundColor: '#6B7280',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y - markLength}px`,
                  width: `${markWidth}px`,
                  height: `${markLength}px`,
                  backgroundColor: '#6B7280',
                }}
              />
            </React.Fragment>
          );
        }

        if (col > 0 && row < labelsPerColumn) {
          marks.push(
            <React.Fragment key={`tr-${row}-${col}`}>
              <div
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${markLength}px`,
                  height: `${markWidth}px`,
                  backgroundColor: '#6B7280',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y - markLength}px`,
                  width: `${markWidth}px`,
                  height: `${markLength}px`,
                  backgroundColor: '#6B7280',
                }}
              />
            </React.Fragment>
          );
        }

        if (col < labelsPerRow && row > 0) {
          marks.push(
            <React.Fragment key={`bl-${row}-${col}`}>
              <div
                style={{
                  position: 'absolute',
                  left: `${x - markLength}px`,
                  top: `${y}px`,
                  width: `${markLength}px`,
                  height: `${markWidth}px`,
                  backgroundColor: '#6B7280',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${markWidth}px`,
                  height: `${markLength}px`,
                  backgroundColor: '#6B7280',
                }}
              />
            </React.Fragment>
          );
        }

        if (col > 0 && row > 0) {
          marks.push(
            <React.Fragment key={`br-${row}-${col}`}>
              <div
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${markLength}px`,
                  height: `${markWidth}px`,
                  backgroundColor: '#6B7280',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${markWidth}px`,
                  height: `${markLength}px`,
                  backgroundColor: '#6B7280',
                }}
              />
            </React.Fragment>
          );
        }
      }
    }

    return marks;
  };

  const labels = [];
  for (let row = 0; row < labelsPerColumn; row++) {
    for (let col = 0; col < labelsPerRow; col++) {
      const x = marginLeftPx + col * (labelWidthPx + gapXPx);
      const y = marginTopPx + row * (labelHeightPx + gapYPx);
      labels.push(
        <div
          key={`label-${row}-${col}`}
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
          }}
        >
          <SingleLabel labelData={currentLabel} scale={scale} />
        </div>
      );
    }
  }

  return (
    <div className="relative">
      <div
        ref={sheetRef}
        className="relative bg-white shadow-xl"
        style={{
          width: `${paperWidthPx}px`,
          height: `${paperHeightPx}px`,
          minWidth: `${paperWidthPx}px`,
          minHeight: `${paperHeightPx}px`,
        }}
        data-print-sheet="true"
      >
        {renderCropMarks()}
        {labels}
      </div>
      
      <div className="mt-4 text-center text-sm text-stone-500 flex items-center justify-center gap-2">
        <Scissors className="w-4 h-4" />
        <span>纸张尺寸：{paperWidth} × {paperHeight} mm | 共 {labelsPerRow * labelsPerColumn} 张标签</span>
      </div>
    </div>
  );
}
