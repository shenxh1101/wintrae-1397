import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLabelStore } from '@/store/labelStore';
import Navbar from '@/components/common/Navbar';
import PrintSettingsPanel from '@/components/print/PrintSettingsPanel';
import LabelSheet from '@/components/print/LabelSheet';
import SingleLabel from '@/components/print/SingleLabel';
import { exportAsImage, exportAsPDF, printLabels, generateThumbnail } from '@/utils/export';
import { Eye, Printer, Download, FileImage, FileText, ArrowLeft, ZoomIn, ZoomOut, Grid3X3, Image as ImageIcon } from 'lucide-react';
import Toast from '@/components/common/Toast';
import Modal from '@/components/common/Modal';

type ViewMode = 'sheet' | 'single';

export default function PreviewPage() {
  const currentLabel = useLabelStore((state) => state.currentLabel);
  const printSettings = useLabelStore((state) => state.printSettings);
  const saveDraft = useLabelStore((state) => state.saveDraft);
  const [viewMode, setViewMode] = useState<ViewMode>('sheet');
  const [zoom, setZoom] = useState(0.5);
  const [showSettings, setShowSettings] = useState(true);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');
  const [exportScale, setExportScale] = useState(2);
  const [isExporting, setIsExporting] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const singleLabelRef = useRef<HTMLDivElement>(null);

  if (!currentLabel) {
    return (
      <div className="h-screen flex flex-col bg-cream-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🧼</div>
            <h2 className="text-xl font-semibold text-stone-700 mb-2">暂无标签数据</h2>
            <p className="text-stone-500 mb-6">请先选择模板并编辑标签</p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回模板选择
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handlePrint = () => {
    showToast('正在准备打印...');
    setTimeout(() => {
      printLabels();
    }, 500);
  };

  const handleExportSingle = async () => {
    if (!singleLabelRef.current) return;
    
    setIsExporting(true);
    try {
      await exportAsImage(singleLabelRef.current, {
        format: exportFormat,
        quality: 0.95,
        scale: exportScale,
        filename: `${currentLabel.name || 'label'}-single`,
      });
      showToast('单张图片导出成功');
      setShowExportModal(false);
    } catch (e) {
      showToast('导出失败，请重试', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSheet = async () => {
    if (!sheetRef.current) return;
    
    setIsExporting(true);
    try {
      const sheets = [];
      for (let i = 0; i < printSettings.copies; i++) {
        sheets.push(sheetRef.current);
      }
      
      await exportAsPDF(sheets, printSettings, `${currentLabel.name || 'labels'}-sheet`);
      showToast('整页PDF导出成功');
    } catch (e) {
      showToast('导出失败，请重试', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!singleLabelRef.current) return;
    
    try {
      const thumbnail = await generateThumbnail(singleLabelRef.current);
      const draftName = currentLabel.name || `未命名草稿 ${new Date().toLocaleString('zh-CN')}`;
      saveDraft(draftName, thumbnail);
      showToast('草稿保存成功');
    } catch (e) {
      showToast('保存失败，请重试', 'error');
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col bg-cream-100">
        <Navbar />

        <div className="flex-1 flex overflow-hidden">
          <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${showSettings ? 'mr-80' : 'mr-0'}`}>
            <div className="no-print bg-white/80 backdrop-blur-sm border-b border-cream-200 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to={`/editor/${currentLabel.templateId}`}
                  className="flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">返回编辑</span>
                </Link>

                <div className="h-6 w-px bg-stone-300" />

                <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('single')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'single'
                        ? 'bg-white text-warm-brown-700 shadow-sm'
                        : 'text-stone-600 hover:text-stone-800'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    单张预览
                  </button>
                  <button
                    onClick={() => setViewMode('sheet')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'sheet'
                        ? 'bg-white text-warm-brown-700 shadow-sm'
                        : 'text-stone-600 hover:text-stone-800'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                    整页排版
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
                  <button
                    onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
                    className="p-1.5 rounded-md hover:bg-white transition-colors"
                    title="缩小"
                  >
                    <ZoomOut className="w-4 h-4 text-stone-600" />
                  </button>
                  <span className="text-sm font-medium text-stone-700 w-14 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
                    className="p-1.5 rounded-md hover:bg-white transition-colors"
                    title="放大"
                  >
                    <ZoomIn className="w-4 h-4 text-stone-600" />
                  </button>
                </div>

                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    showSettings
                      ? 'bg-warm-brown-100 text-warm-brown-700'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  设置
                </button>

                <div className="h-6 w-px bg-stone-300" />

                <button
                  onClick={handleSaveDraft}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  保存草稿
                </button>

                <button
                  onClick={() => setShowExportModal(true)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FileImage className="w-4 h-4" />
                  导出图片
                </button>

                <button
                  onClick={handleExportSheet}
                  disabled={isExporting}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  导出PDF
                </button>

                <button
                  onClick={handlePrint}
                  className="btn-primary flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  打印
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-8 flex items-start justify-center bg-stone-200/50">
              {viewMode === 'single' ? (
                <div ref={singleLabelRef}>
                  <SingleLabel labelData={currentLabel} scale={zoom * 2} showBorder />
                </div>
              ) : (
                <div ref={sheetRef} style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
                  <LabelSheet scale={1} />
                </div>
              )}
            </div>
          </div>

          {showSettings && (
            <div className="fixed right-0 top-16 bottom-0 w-80 z-30">
              <PrintSettingsPanel />
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="导出单张图片"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">图片格式</label>
            <div className="flex gap-3">
              {(['png', 'jpeg'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    exportFormat === format
                      ? 'bg-warm-brown-100 text-warm-brown-800 border-2 border-warm-brown-400'
                      : 'bg-stone-50 text-stone-700 border-2 border-transparent hover:bg-stone-100'
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-500 mt-2">
              {exportFormat === 'png' ? 'PNG 支持透明背景，适合网页使用' : 'JPEG 文件更小，适合打印'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              导出质量：{exportScale}x ({exportScale * 96} DPI)
            </label>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={exportScale}
              onChange={(e) => setExportScale(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-warm-brown-500"
            />
            <div className="flex justify-between text-xs text-stone-500 mt-1">
              <span>1x (96 DPI)</span>
              <span>2x (192 DPI)</span>
              <span>3x (288 DPI)</span>
              <span>4x (384 DPI)</span>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-lg">
            <div className="text-sm text-stone-600 space-y-1">
              <p>标签尺寸：{currentLabel.width.toFixed(1)} × {currentLabel.height.toFixed(1)} cm</p>
              <p>导出尺寸：{Math.round(currentLabel.width * 37.8 * exportScale)} × {Math.round(currentLabel.height * 37.8 * exportScale)} px</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowExportModal(false)}
              className="flex-1 btn-secondary"
            >
              取消
            </button>
            <button
              onClick={handleExportSingle}
              disabled={isExporting}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  导出中...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  导出
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
        />
      )}
    </>
  );
}
