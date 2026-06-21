import { useState } from 'react';
import { Palette } from 'lucide-react';
import { defaultColorSchemes } from '@/utils/colors';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  showPresets?: boolean;
}

export default function ColorPicker({ value, onChange, label, showPresets = true }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presetColors = [
    '#8B7355', '#9CAF88', '#D4A574', '#C9B1D6', '#E8C4C4', '#B8D8D0',
    '#5D6D7E', '#C17F59', '#7D669E', '#6B8E6B', '#A67C52', '#CD853F',
    '#5A4A37', '#3D4F3D', '#34495E', '#8B4513', '#5B497A', '#6B4423',
    '#FFFFFF', '#FAF8F5', '#F5F1EB', '#E8E1D9', '#000000', '#6F5B44',
  ];

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-brown-600 mb-1.5">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-cream-50 border border-brown-100 rounded-xl hover:border-brown-200 transition-colors"
        >
          <div
            className="w-6 h-6 rounded-lg border border-brown-200 shadow-inner"
            style={{ backgroundColor: value }}
          />
          <span className="text-sm text-brown-600 font-mono">{value.toUpperCase()}</span>
          <Palette size={16} className="text-brown-400" />
        </button>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-white rounded-xl shadow-lg border border-cream-200 z-50 w-64">
          {showPresets && (
            <>
              <div className="mb-3">
                <p className="text-xs font-medium text-brown-500 mb-2">预设颜色</p>
                <div className="grid grid-cols-6 gap-1.5">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        onChange(color);
                        setIsOpen(false);
                      }}
                      className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${
                        value.toLowerCase() === color.toLowerCase()
                          ? 'border-brown-400 ring-2 ring-brown-200'
                          : 'border-brown-100'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-cream-100">
                <p className="text-xs font-medium text-brown-500 mb-2">预设配色方案</p>
                <div className="space-y-2">
                  {defaultColorSchemes.map((scheme, idx) => (
                    <div
                      key={idx}
                      className="flex gap-1 p-2 rounded-lg hover:bg-cream-50 cursor-pointer transition-colors"
                      onClick={() => {
                        onChange(scheme.primary);
                        setIsOpen(false);
                      }}
                    >
                      {Object.values(scheme).slice(0, 5).map((color, i) => (
                        <div
                          key={i}
                          className="flex-1 h-6 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
