import { useState, useMemo } from 'react';
import { Search, Plus, Heart, Clock, Grid3X3 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { iconCategories, searchIcons, getIconsByCategory, getAllIcons } from '@/utils/icons';
import { useLabelStore } from '@/store/labelStore';
import { useIconStore } from '@/store/iconStore';

export default function IconLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const addElement = useLabelStore((state) => state.addElement);
  const currentLabel = useLabelStore((state) => state.currentLabel);
  const favorites = useIconStore((state) => state.favorites);
  const recent = useIconStore((state) => state.recent);
  const toggleFavorite = useIconStore((state) => state.toggleFavorite);
  const addToRecent = useIconStore((state) => state.addToRecent);
  const isFavorite = useIconStore((state) => state.isFavorite);

  const allIcons = useMemo(() => getAllIcons(), []);

  const filteredIcons = useMemo(() => {
    if (searchQuery) {
      return searchIcons(searchQuery);
    }
    if (selectedCategory === 'favorites') {
      return allIcons.filter((icon) => favorites.includes(icon.name));
    }
    if (selectedCategory === 'recent') {
      return recent
        .map((name) => allIcons.find((icon) => icon.name === name))
        .filter((icon): icon is typeof allIcons[0] => icon !== undefined);
    }
    return getIconsByCategory(selectedCategory);
  }, [searchQuery, selectedCategory, favorites, recent, allIcons]);

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
      iconStrokeWidth: 2,
    });
    addToRecent(iconName);
  };

  const specialCategories = [
    { id: 'favorites', name: '收藏', icon: Heart },
    { id: 'recent', name: '最近', icon: Clock },
  ];

  return (
    <div className="space-y-4">
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

      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-brown-400 text-white'
              : 'bg-cream-100 text-brown-600 hover:bg-cream-200'
          }`}
        >
          <Grid3X3 size={12} />
          全部
        </button>
        {specialCategories.map((cat) => {
          const CatIcon = cat.icon;
          const count = cat.id === 'favorites' ? favorites.length : recent.length;
          if (count === 0 && !searchQuery && selectedCategory !== cat.id) return null;
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
              <CatIcon size={12} />
              {cat.name}
              {count > 0 && (
                <span className="text-[10px] bg-white/30 px-1 rounded">{count}</span>
              )}
            </button>
          );
        })}
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

      <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto p-2">
        {filteredIcons.map((iconItem) => {
          const IconComponent = (LucideIcons as unknown as Record<string, React.FC<{ size?: number; className?: string }>>)[iconItem.name];
          if (!IconComponent) return null;
          const fav = isFavorite(iconItem.name);

          return (
            <div
              key={iconItem.name}
              className="group relative aspect-square flex items-center justify-center rounded-xl bg-cream-50 border border-brown-100 hover:border-brown-300 hover:bg-white transition-all"
            >
              <button
                onClick={() => handleAddIcon(iconItem.name)}
                className="w-full h-full flex items-center justify-center"
                title={iconItem.name}
              >
                <IconComponent size={20} className="text-brown-500 group-hover:text-brown-600" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-brown-400 text-white p-1 rounded-full">
                    <Plus size={12} />
                  </div>
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(iconItem.name);
                }}
                className={`absolute top-1 right-1 p-0.5 rounded transition-all opacity-0 group-hover:opacity-100 hover:scale-110 ${
                  fav ? 'opacity-100 text-red-500' : 'text-brown-400 hover:text-red-400'
                }`}
                title={fav ? '取消收藏' : '收藏'}
              >
                <Heart size={12} fill={fav ? 'currentColor' : 'none'} />
              </button>
            </div>
          );
        })}
      </div>

      {filteredIcons.length === 0 && (
        <div className="text-center py-8 text-brown-400 text-sm">
          {selectedCategory === 'favorites' ? '还没有收藏的图标' :
          selectedCategory === 'recent' ? '还没有使用过的图标' :
          '没有找到匹配的图标'}
        </div>
      )}
    </div>
  );
}
