import { useState } from 'react';
import {
  Type,
  Palette,
  Settings,
  ChevronDown,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ArrowUpFromLine,
  ArrowDownToLine,
  MoveUp,
  MoveDown,
} from 'lucide-react';
import ColorPicker from '../common/ColorPicker';
import { useLabelStore } from '@/store/labelStore';
import { defaultColorSchemes } from '@/utils/colors';

export default function RightPanel() {
  const [activeTab, setActiveTab] = useState<'element' | 'style' | 'settings'>('element');
  const [expandedSections, setExpandedSections] = useState<string[]>(['text', 'position']);

  const currentLabel = useLabelStore((state) => state.currentLabel);
  const selectedElementId = useLabelStore((state) => state.selectedElementId);
  const updateElement = useLabelStore((state) => state.updateElement);
  const deleteElement = useLabelStore((state) => state.deleteElement);
  const duplicateElement = useLabelStore((state) => state.duplicateElement);
  const bringToFront = useLabelStore((state) => state.bringToFront);
  const sendToBack = useLabelStore((state) => state.sendToBack);
  const moveElementForward = useLabelStore((state) => state.moveElementForward);
  const moveElementBackward = useLabelStore((state) => state.moveElementBackward);
  const updateColors = useLabelStore((state) => state.updateColors);
  const applyColorScheme = useLabelStore((state) => state.applyColorScheme);

  const selectedElement = currentLabel?.elements.find((el) => el.id === selectedElementId);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const fontFamilies = [
    { value: 'sans', label: '无衬线体' },
    { value: 'serif', label: '衬线体' },
    { value: 'handwritten', label: '手写体' },
  ];

  const tabs = [
    { id: 'element', label: '属性', icon: Settings },
    { id: 'style', label: '样式', icon: Palette },
    { id: 'settings', label: '全局', icon: Palette },
  ] as const;

  const renderElementTab = () => {
    if (!selectedElement) {
      return (
        <div className="text-center py-12 text-brown-400">
          <Type size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">选择一个元素进行编辑</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* 元素操作按钮 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => duplicateElement(selectedElement.id)}
            className="flex-1 btn-secondary text-xs py-1.5 flex items-center justify-center gap-1"
          >
            <Copy size={14} />
            复制
          </button>
          <button
            onClick={() => updateElement(selectedElement.id, { locked: !selectedElement.locked })}
            className={`flex-1 btn-secondary text-xs py-1.5 flex items-center justify-center gap-1 ${
              selectedElement.locked ? 'bg-brown-100 text-brown-600' : ''
            }`}
          >
            {selectedElement.locked ? <Unlock size={14} /> : <Lock size={14} />}
            {selectedElement.locked ? '解锁' : '锁定'}
          </button>
          <button
            onClick={() => updateElement(selectedElement.id, { visible: !selectedElement.visible })}
            className={`flex-1 btn-secondary text-xs py-1.5 flex items-center justify-center gap-1 ${
              !selectedElement.visible ? 'bg-brown-100 text-brown-600' : ''
            }`}
          >
            {selectedElement.visible ? <EyeOff size={14} /> : <Eye size={14} />}
            {selectedElement.visible ? '隐藏' : '显示'}
          </button>
          <button
            onClick={() => deleteElement(selectedElement.id)}
            className="btn-secondary text-xs py-1.5 px-2 text-red-500 hover:bg-red-50"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* 图层排序 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => bringToFront(selectedElement.id)}
            className="flex-1 btn-ghost text-xs flex items-center justify-center gap-1"
          >
            <ArrowUpFromLine size={14} />
            置顶
          </button>
          <button
            onClick={() => moveElementForward(selectedElement.id)}
            className="flex-1 btn-ghost text-xs flex items-center justify-center gap-1"
          >
            <MoveUp size={14} />
            上移
          </button>
          <button
            onClick={() => moveElementBackward(selectedElement.id)}
            className="flex-1 btn-ghost text-xs flex items-center justify-center gap-1"
          >
            <MoveDown size={14} />
            下移
          </button>
          <button
            onClick={() => sendToBack(selectedElement.id)}
            className="flex-1 btn-ghost text-xs flex items-center justify-center gap-1"
          >
            <ArrowDownToLine size={14} />
            置底
          </button>
        </div>

        {/* 位置和大小 */}
        <div className="border-t border-cream-200 pt-4">
          <button
            onClick={() => toggleSection('position')}
            className="w-full flex items-center justify-between mb-3"
          >
            <span className="font-medium text-brown-700 text-sm">位置和大小</span>
            <ChevronDown
              size={16}
              className={`text-brown-400 transition-transform ${
                expandedSections.includes('position') ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedSections.includes('position') && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-brown-500 mb-1">X (%)</label>
                <input
                  type="number"
                  value={selectedElement.x.toFixed(1)}
                  onChange={(e) => updateElement(selectedElement.id, { x: parseFloat(e.target.value) || 0 })}
                  className="input-field text-sm py-1.5"
                  min="0"
                  max="100"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-xs text-brown-500 mb-1">Y (%)</label>
                <input
                  type="number"
                  value={selectedElement.y.toFixed(1)}
                  onChange={(e) => updateElement(selectedElement.id, { y: parseFloat(e.target.value) || 0 })}
                  className="input-field text-sm py-1.5"
                  min="0"
                  max="100"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-xs text-brown-500 mb-1">宽度 (%)</label>
                <input
                  type="number"
                  value={selectedElement.width.toFixed(1)}
                  onChange={(e) => updateElement(selectedElement.id, { width: parseFloat(e.target.value) || 10 })}
                  className="input-field text-sm py-1.5"
                  min="1"
                  max="100"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-xs text-brown-500 mb-1">高度 (%)</label>
                <input
                  type="number"
                  value={selectedElement.height.toFixed(1)}
                  onChange={(e) => updateElement(selectedElement.id, { height: parseFloat(e.target.value) || 10 })}
                  className="input-field text-sm py-1.5"
                  min="1"
                  max="100"
                  step="0.5"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-brown-500 mb-1">旋转 (°)</label>
                <input
                  type="range"
                  value={selectedElement.rotation}
                  onChange={(e) => updateElement(selectedElement.id, { rotation: parseInt(e.target.value) })}
                  className="w-full"
                  min="0"
                  max="360"
                />
                <div className="text-xs text-brown-400 text-center">{selectedElement.rotation}°</div>
              </div>
            </div>
          )}
        </div>

        {/* 文字设置 */}
        {selectedElement.type === 'text' && (
          <div className="border-t border-cream-200 pt-4">
            <button
              onClick={() => toggleSection('text')}
              className="w-full flex items-center justify-between mb-3"
            >
              <span className="font-medium text-brown-700 text-sm">文字设置</span>
              <ChevronDown
                size={16}
                className={`text-brown-400 transition-transform ${
                  expandedSections.includes('text') ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.includes('text') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-brown-500 mb-1">文字内容</label>
                  <textarea
                    value={selectedElement.content || ''}
                    onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                    className="input-field text-sm py-1.5 resize-none"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-brown-500 mb-1">字体</label>
                    <select
                      value={selectedElement.fontFamily || 'sans'}
                      onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                      className="input-field text-sm py-1.5"
                    >
                      {fontFamilies.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-brown-500 mb-1">字号</label>
                    <input
                      type="number"
                      value={selectedElement.fontSize || 14}
                      onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 14 })}
                      className="input-field text-sm py-1.5"
                      min="6"
                      max="72"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-brown-500 mb-1">粗细</label>
                    <select
                      value={selectedElement.fontWeight || 400}
                      onChange={(e) => updateElement(selectedElement.id, { fontWeight: parseInt(e.target.value) })}
                      className="input-field text-sm py-1.5"
                    >
                      <option value={300}>细</option>
                      <option value={400}>正常</option>
                      <option value={600}>半粗</option>
                      <option value={700}>粗</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-brown-500 mb-1">样式</label>
                    <select
                      value={selectedElement.fontStyle || 'normal'}
                      onChange={(e) => updateElement(selectedElement.id, { fontStyle: e.target.value as 'normal' | 'italic' })}
                      className="input-field text-sm py-1.5"
                    >
                      <option value="normal">正常</option>
                      <option value="italic">斜体</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-brown-500 mb-1">对齐</label>
                    <select
                      value={selectedElement.textAlign || 'center'}
                      onChange={(e) => updateElement(selectedElement.id, { textAlign: e.target.value as 'left' | 'center' | 'right' })}
                      className="input-field text-sm py-1.5"
                    >
                      <option value="left">左</option>
                      <option value="center">中</option>
                      <option value="right">右</option>
                    </select>
                  </div>
                </div>
                <div>
                  <ColorPicker
                    label="文字颜色"
                    value={selectedElement.color || '#000000'}
                    onChange={(color) => updateElement(selectedElement.id, { color })}
                    showPresets={false}
                  />
                </div>
                <div>
                  <label className="block text-xs text-brown-500 mb-1">行高</label>
                  <input
                    type="range"
                    value={(selectedElement.lineHeight || 1.5) * 10}
                    onChange={(e) => updateElement(selectedElement.id, { lineHeight: parseInt(e.target.value) / 10 })}
                    className="w-full"
                    min="10"
                    max="30"
                  />
                  <div className="text-xs text-brown-400 text-center">{selectedElement.lineHeight || 1.5}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 图标设置 */}
        {selectedElement.type === 'icon' && (
          <div className="border-t border-cream-200 pt-4 space-y-4">
            <ColorPicker
              label="图标颜色"
              value={selectedElement.iconColor || '#000000'}
              onChange={(color) => updateElement(selectedElement.id, { iconColor: color })}
              showPresets={false}
            />
            <div>
              <label className="block text-xs text-brown-500 mb-1">线条粗细</label>
              <input
                type="range"
                value={selectedElement.strokeWidth || 2}
                onChange={(e) => updateElement(selectedElement.id, { strokeWidth: parseInt(e.target.value) })}
                className="w-full"
                min="1"
                max="6"
              />
              <div className="text-xs text-brown-400 text-center">{selectedElement.strokeWidth || 2}px</div>
            </div>
          </div>
        )}

        {/* 形状设置 */}
        {selectedElement.type === 'shape' && (
          <div className="border-t border-cream-200 pt-4 space-y-4">
            <ColorPicker
              label="填充颜色"
              value={selectedElement.fillColor || 'transparent'}
              onChange={(color) => updateElement(selectedElement.id, { fillColor: color })}
              showPresets={false}
            />
            <ColorPicker
              label="边框颜色"
              value={selectedElement.strokeColor || '#000000'}
              onChange={(color) => updateElement(selectedElement.id, { strokeColor: color })}
              showPresets={false}
            />
            <div>
              <label className="block text-xs text-brown-500 mb-1">边框粗细</label>
              <input
                type="range"
                value={selectedElement.strokeWidth || 2}
                onChange={(e) => updateElement(selectedElement.id, { strokeWidth: parseInt(e.target.value) })}
                className="w-full"
                min="0"
                max="10"
              />
              <div className="text-xs text-brown-400 text-center">{selectedElement.strokeWidth || 2}px</div>
            </div>
            {selectedElement.shapeType === 'rect' && (
              <div>
                <label className="block text-xs text-brown-500 mb-1">圆角</label>
                <input
                  type="range"
                  value={selectedElement.borderRadius || 0}
                  onChange={(e) => updateElement(selectedElement.id, { borderRadius: parseInt(e.target.value) })}
                  className="w-full"
                  min="0"
                  max="50"
                />
                <div className="text-xs text-brown-400 text-center">{selectedElement.borderRadius || 0}px</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderStyleTab = () => {
    if (!currentLabel) return null;

    return (
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-brown-700 text-sm mb-3">配色方案</h4>
          <div className="grid grid-cols-2 gap-2">
            {defaultColorSchemes.map((scheme, idx) => (
              <button
                key={idx}
                onClick={() => applyColorScheme(scheme)}
                className="p-2 rounded-xl border-2 border-transparent hover:border-brown-300 transition-all bg-white"
              >
                <div className="flex gap-0.5 rounded-lg overflow-hidden h-8 mb-2">
                  <div className="flex-1" style={{ backgroundColor: scheme.primary }} />
                  <div className="flex-1" style={{ backgroundColor: scheme.secondary }} />
                  <div className="flex-1" style={{ backgroundColor: scheme.accent }} />
                  <div className="flex-1" style={{ backgroundColor: scheme.background }} />
                  <div className="flex-1" style={{ backgroundColor: scheme.text }} />
                </div>
                <p className="text-xs text-brown-500 text-center">方案 {idx + 1}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <ColorPicker
            label="主色调"
            value={currentLabel.colors.primary}
            onChange={(color) => updateColors({ primary: color })}
          />
          <ColorPicker
            label="辅助色"
            value={currentLabel.colors.secondary}
            onChange={(color) => updateColors({ secondary: color })}
          />
          <ColorPicker
            label="强调色"
            value={currentLabel.colors.accent}
            onChange={(color) => updateColors({ accent: color })}
          />
          <ColorPicker
            label="背景色"
            value={currentLabel.colors.background}
            onChange={(color) => updateColors({ background: color })}
          />
          <ColorPicker
            label="文字色"
            value={currentLabel.colors.text}
            onChange={(color) => updateColors({ text: color })}
          />
        </div>
      </div>
    );
  };

  const renderSettingsTab = () => {
    if (!currentLabel) return null;

    return (
      <div className="space-y-6">
        <div className="p-4 bg-cream-50 rounded-xl">
          <h4 className="font-medium text-brown-700 text-sm mb-2">成分文本预览</h4>
          <p className="text-xs text-brown-500 leading-relaxed">
            {currentLabel.ingredients
              .sort((a, b) => a.order - b.order)
              .map((ing) => ing.name + (ing.isAllergen ? ' ⚠' : ''))
              .join('、')}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-brown-600">标签尺寸</span>
            <span className="text-brown-400">{currentLabel.width} × {currentLabel.height} cm</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-brown-600">元素数量</span>
            <span className="text-brown-400">{currentLabel.elements.length} 个</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-brown-600">成分数量</span>
            <span className="text-brown-400">{currentLabel.ingredients.length} 种</span>
          </div>
        </div>

        <div className="p-4 bg-sage-50 rounded-xl border border-sage-200">
          <h5 className="font-medium text-sage-700 text-sm mb-2">过敏提示</h5>
          <p className="text-xs text-sage-600 leading-relaxed">
            {currentLabel.allergyWarning || '未设置过敏提示'}
          </p>
          {currentLabel.ingredients.filter(i => i.isAllergen).length > 0 && (
            <div className="mt-2 pt-2 border-t border-sage-200">
              <p className="text-xs text-red-500">
                ⚠ 已标记过敏原：{currentLabel.ingredients.filter(i => i.isAllergen).map(i => i.name).join('、')}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="no-print w-80 border-l border-cream-200 bg-white overflow-y-auto h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-cream-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-brown-600'
                  : 'text-brown-400 hover:text-brown-600'
              }`}
            >
              <Icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brown-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'element' && renderElementTab()}
        {activeTab === 'style' && renderStyleTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
}
