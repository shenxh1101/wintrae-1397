import { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { iconCategories, searchIcons, getIconsByCategory } from '@/utils/icons';
import { useLabelStore } from '@/store/labelStore';

export default function IconLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const addElement = useLabelStore((state) => state.addElement);
  const currentLabel = useLabelStore((state) => state.currentLabel);

  const filteredIcons = useMemo(() => {
    if (searchQuery) {
      return searchIcons(searchQuery);
    }
    return getIconsByCategory(selectedCategory);
  }, [searchQuery, selectedCategory]);

  const handleAddIcon = (iconName: string) => {
    if (!currentLabel) return;
    
    addElement({
      type: 'icon',
      x: 40,
      y: 40,
      width: 15,
      height: 15,
      rotation: 0,
      zIndex: Math.max(...currentLabel.elements.map(e => e.zIndex), 0) + 1,
      locked: false,
      visible: true,
      iconName,
      iconColor: currentLabel.colors.primary,
      strokeWidth: 2,
    });
  };

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索图标..."
          className="input-field pl-9"
        />
      </div>

      {/* 分类标签 */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-brown-400 text-white'
              : 'bg-cream-100 text-brown-600 hover:bg-cream-200'
          }`}
        >
          全部
        </button>
        {iconCategories.map((cat) => {
          const CatIcon = (LucideIcons as unknown as Record<string, React.FC<{ size?: number }>>)[cat.icon];
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-brown-400 text-white'
                  : 'bg-cream-100 text-brown-600 hover:bg-cream-200'
              }`}
            >
              {CatIcon && <CatIcon size={12} />}
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* 图标网格 */}
      <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto p-2">
        {filteredIcons.map((iconItem) => {
          const IconComponent = (LucideIcons as unknown as Record<string, React.FC<{ size?: number; className?: string }>>)[iconItem.name];
          if (!IconComponent) return null;

          return (
            <button
              key={iconItem.name}
              onClick={() => handleAddIcon(iconItem.name)}
              className="group relative aspect-square flex items-center justify-center rounded-xl bg-cream-50 border border-brown-100 hover:border-brown-300 hover:bg-white transition-all"
              title={iconItem.name}
            >
              <IconComponent size={20} className="text-brown-500 group-hover:text-brown-600" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-brown-400 text-white p-1 rounded-full">
                  <Plus size={12} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredIcons.length === 0 && (
        <div className="text-center py-8 text-brown-400 text-sm">
          没有找到匹配的图标
        </div>
      )}
    </div>
  );
}
