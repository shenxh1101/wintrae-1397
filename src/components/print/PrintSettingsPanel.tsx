import { useLabelStore } from '@/store/labelStore';
import type { PaperSize } from '@/types';
import { getPaperDimensions } from '@/utils/units';
import { Settings, Grid, Maximize2, Copy, Scissors } from 'lucide-react';

const paperSizeOptions: { value: PaperSize; label: string; width: number; height: number }[] = [
  { value: 'A4', label: 'A4 (210 × 297 mm)', width: 210, height: 297 },
  { value: 'A5', label: 'A5 (148 × 210 mm)', width: 148, height: 210 },
  { value: '6inch', label: '6寸相纸 (102 × 152 mm)', width: 102, height: 152 },
  { value: 'custom', label: '自定义尺寸', width: 0, height: 0 },
];

export default function PrintSettingsPanel() {
  const printSettings = useLabelStore((state) => state.printSettings);
  const updatePrintSettings = useLabelStore((state) => state.updatePrintSettings);
  const currentLabel = useLabelStore((state) => state.currentLabel);

  const handlePaperSizeChange = (size: PaperSize) => {
    if (size === 'custom') {
      updatePrintSettings({ paperSize: size });
    } else {
      const dims = getPaperDimensions(size);
      updatePrintSettings({
        paperSize: size,
        paperWidth: dims.width,
        paperHeight: dims.height,
      });
    }
  };

  const calculateAutoLayout = () => {
    if (!currentLabel) return;
    
    const { paperWidth, paperHeight, marginTop, marginBottom, marginLeft, marginRight, gapX, gapY } = printSettings;
    const labelWidth = currentLabel.width * 10;
    const labelHeight = currentLabel.height * 10;
    
    const availableWidth = paperWidth - marginLeft - marginRight;
    const availableHeight = paperHeight - marginTop - marginBottom;
    
    const labelsPerRow = Math.floor((availableWidth + gapX) / (labelWidth + gapX));
    const labelsPerColumn = Math.floor((availableHeight + gapY) / (labelHeight + gapY));
    
    updatePrintSettings({
      labelsPerRow: Math.max(1, labelsPerRow),
      labelsPerColumn: Math.max(1, labelsPerColumn),
    });
  };

  const totalLabels = printSettings.labelsPerRow * printSettings.labelsPerColumn * printSettings.copies;

  return (
    <div className="w-80 bg-white border-l border-stone-200 flex flex-col h-full">
      <div className="p-4 border-b border-stone-200">
        <h2 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          打印设置
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-stone-700">纸张规格</label>
          <div className="space-y-2">
            {paperSizeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handlePaperSizeChange(option.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  printSettings.paperSize === option.value
                    ? 'bg-warm-brown-100 text-warm-brown-800 border-2 border-warm-brown-400'
                    : 'bg-stone-50 text-stone-700 border-2 border-transparent hover:bg-stone-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {printSettings.paperSize === 'custom' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">宽度 (mm)</label>
              <input
                type="number"
                value={printSettings.paperWidth}
                onChange={(e) => updatePrintSettings({ paperWidth: Number(e.target.value) })}
                className="input-field w-full"
                min="50"
                max="500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">高度 (mm)</label>
              <input
                type="number"
                value={printSettings.paperHeight}
                onChange={(e) => updatePrintSettings({ paperHeight: Number(e.target.value) })}
                className="input-field w-full"
                min="50"
                max="500"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
              <Grid className="w-4 h-4" />
              标签排版
            </label>
            <button
              onClick={calculateAutoLayout}
              className="text-xs text-warm-brown-600 hover:text-warm-brown-800 underline"
            >
              自动计算
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-stone-600 mb-1">每行数量</label>
              <input
                type="number"
                value={printSettings.labelsPerRow}
                onChange={(e) => updatePrintSettings({ labelsPerRow: Math.max(1, Number(e.target.value)) })}
                className="input-field w-full"
                min="1"
                max="20"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">每列数量</label>
              <input
                type="number"
                value={printSettings.labelsPerColumn}
                onChange={(e) => updatePrintSettings({ labelsPerColumn: Math.max(1, Number(e.target.value)) })}
                className="input-field w-full"
                min="1"
                max="20"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
            <Maximize2 className="w-4 h-4" />
            边距设置 (mm)
          </label>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-stone-600 mb-1">上边距</label>
              <input
                type="number"
                value={printSettings.marginTop}
                onChange={(e) => updatePrintSettings({ marginTop: Number(e.target.value) })}
                className="input-field w-full"
                min="0"
                max="50"
                step="0.5"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">下边距</label>
              <input
                type="number"
                value={printSettings.marginBottom}
                onChange={(e) => updatePrintSettings({ marginBottom: Number(e.target.value) })}
                className="input-field w-full"
                min="0"
                max="50"
                step="0.5"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">左边距</label>
              <input
                type="number"
                value={printSettings.marginLeft}
                onChange={(e) => updatePrintSettings({ marginLeft: Number(e.target.value) })}
                className="input-field w-full"
                min="0"
                max="50"
                step="0.5"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">右边距</label>
              <input
                type="number"
                value={printSettings.marginRight}
                onChange={(e) => updatePrintSettings({ marginRight: Number(e.target.value) })}
                className="input-field w-full"
                min="0"
                max="50"
                step="0.5"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-stone-700">标签间距 (mm)</label>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-stone-600 mb-1">水平间距</label>
              <input
                type="number"
                value={printSettings.gapX}
                onChange={(e) => updatePrintSettings({ gapX: Number(e.target.value) })}
                className="input-field w-full"
                min="0"
                max="30"
                step="0.5"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">垂直间距</label>
              <input
                type="number"
                value={printSettings.gapY}
                onChange={(e) => updatePrintSettings({ gapY: Number(e.target.value) })}
                className="input-field w-full"
                min="0"
                max="30"
                step="0.5"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
            <Copy className="w-4 h-4" />
            打印份数
          </label>
          <input
            type="number"
            value={printSettings.copies}
            onChange={(e) => updatePrintSettings({ copies: Math.max(1, Number(e.target.value)) })}
            className="input-field w-full"
            min="1"
            max="100"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={printSettings.showCropMarks}
              onChange={(e) => updatePrintSettings({ showCropMarks: e.target.checked })}
              className="w-4 h-4 rounded border-stone-300 text-warm-brown-600 focus:ring-warm-brown-500"
            />
            <span className="text-sm font-medium text-stone-700 flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              显示裁切线
            </span>
          </label>
        </div>

        <div className="p-4 bg-stone-50 rounded-lg">
          <div className="text-sm text-stone-600 space-y-1">
            <p>纸张尺寸：{printSettings.paperWidth} × {printSettings.paperHeight} mm</p>
            <p>标签尺寸：{currentLabel?.width.toFixed(1) || '0'} × {currentLabel?.height.toFixed(1) || '0'} cm</p>
            <p>每页数量：{printSettings.labelsPerRow} × {printSettings.labelsPerColumn} = {printSettings.labelsPerRow * printSettings.labelsPerColumn} 张</p>
            <p className="font-medium text-stone-800 pt-2 border-t border-stone-200">
              总计：{totalLabels} 张标签
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
