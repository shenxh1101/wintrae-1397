import { Filter, Grid3X3 } from 'lucide-react';
import type { TemplateType, TemplateStyle } from '@/types';

interface TemplateFilterProps {
  selectedType: TemplateType | 'all';
  selectedStyle: TemplateStyle | 'all';
  onTypeChange: (type: TemplateType | 'all') => void;
  onStyleChange: (style: TemplateStyle | 'all') => void;
}

const typeOptions = [
  { value: 'all', label: '全部' },
  { value: 'circle', label: '圆形' },
  { value: 'square', label: '方形' },
  { value: 'rectangle', label: '长方形' },
  { value: 'special', label: '异形' },
] as const;

const styleOptions = [
  { value: 'all', label: '全部' },
  { value: 'minimal', label: '简约' },
  { value: 'vintage', label: '复古' },
  { value: 'fresh', label: '清新' },
  { value: 'luxury', label: '奢华' },
  { value: 'cute', label: '可爱' },
] as const;

export default function TemplateFilter({
  selectedType, selectedStyle, onTypeChange, onStyleChange }: TemplateFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex items-center gap-3">
        <Filter size={18} className="text-brown-500" />
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onTypeChange(option.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                selectedType === option.value
                  ? 'bg-brown-400 text-white shadow-soft'
                  : 'bg-white text-brown-600 border border-brown-100 hover:border-brown-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Grid3X3 size={18} className="text-brown-500" />
        <div className="flex flex-wrap gap-2">
          {styleOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStyleChange(option.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                selectedStyle === option.value
                  ? 'bg-sage-400 text-white shadow-soft'
                  : 'bg-white text-brown-600 border border-brown-100 hover:border-brown-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
