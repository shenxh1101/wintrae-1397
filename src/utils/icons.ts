import type { IconItem } from '@/types';

export const iconCategories = [
  { id: 'nature', name: '自然植物', icon: 'Leaf' },
  { id: 'essential-oil', name: '精油芳香', icon: 'Droplets' },
  { id: 'tools', name: '制作工具', icon: 'Beaker' },
  { id: 'decoration', name: '装饰元素', icon: 'Star' },
  { id: 'symbols', name: '符号标识', icon: 'Heart' },
];

export const iconItems: IconItem[] = [
  { name: 'Leaf', category: 'nature', keywords: ['叶子', '植物', '自然'] },
  { name: 'TreeDeciduous', category: 'nature', keywords: ['树', '森林', '自然'] },
  { name: 'TreePine', category: 'nature', keywords: ['松树', '森林', '自然'] },
  { name: 'Flower2', category: 'nature', keywords: ['花', '花朵', '植物'] },
  { name: 'Sprout', category: 'nature', keywords: ['发芽', '幼苗', '植物'] },
  { name: 'Lavender', category: 'nature', keywords: ['薰衣草', '花', '植物'] },
  { name: 'Sun', category: 'nature', keywords: ['太阳', '阳光', '自然'] },
  { name: 'Moon', category: 'nature', keywords: ['月亮', '夜晚', '自然'] },
  { name: 'Cloud', category: 'nature', keywords: ['云', '天空', '自然'] },
  { name: 'Mountain', category: 'nature', keywords: ['山', '自然', '风景'] },
  { name: 'Waves', category: 'nature', keywords: ['波浪', '水', '海洋'] },
  { name: 'Wind', category: 'nature', keywords: ['风', '空气', '自然'] },
  { name: 'Droplets', category: 'essential-oil', keywords: ['水滴', '精油', '液体'] },
  { name: 'Droplet', category: 'essential-oil', keywords: ['水滴', '精油', '液体'] },
  { name: 'Flame', category: 'essential-oil', keywords: ['火焰', '热', '温暖'] },
  { name: 'Snowflake', category: 'essential-oil', keywords: ['雪花', '冷', '清凉'] },
  { name: 'Coffee', category: 'essential-oil', keywords: ['咖啡', '香味'] },
  { name: 'Cherry', category: 'essential-oil', keywords: ['樱桃', '水果', '香味'] },
  { name: 'Citrus', category: 'essential-oil', keywords: ['柑橘', '橙子', '香味'] },
  { name: 'Apple', category: 'essential-oil', keywords: ['苹果', '水果', '香味'] },
  { name: 'Grape', category: 'essential-oil', keywords: ['葡萄', '水果', '香味'] },
  { name: 'Beaker', category: 'tools', keywords: ['烧杯', '实验', '制作'] },
  { name: 'TestTube', category: 'tools', keywords: ['试管', '实验', '制作'] },
  { name: 'Scale', category: 'tools', keywords: ['秤', '重量', '测量'] },
  { name: 'Ruler', category: 'tools', keywords: ['尺子', '测量'] },
  { name: 'Scissors', category: 'tools', keywords: ['剪刀', '工具'] },
  { name: 'Brush', category: 'tools', keywords: ['刷子', '涂抹'] },
  { name: 'Spoon', category: 'tools', keywords: ['勺子', '工具'] },
  { name: 'Bottle', category: 'tools', keywords: ['瓶子', '容器'] },
  { name: 'Package', category: 'tools', keywords: ['包装', '包裹'] },
  { name: 'Tag', category: 'tools', keywords: ['标签', '标记'] },
  { name: 'Star', category: 'decoration', keywords: ['星星', '装饰'] },
  { name: 'Sparkles', category: 'decoration', keywords: ['闪光', '装饰'] },
  { name: 'Heart', category: 'decoration', keywords: ['爱心', '装饰'] },
  { name: 'Circle', category: 'decoration', keywords: ['圆形', '装饰'] },
  { name: 'Square', category: 'decoration', keywords: ['方形', '装饰'] },
  { name: 'Diamond', category: 'decoration', keywords: ['钻石', '装饰'] },
  { name: 'Hexagon', category: 'decoration', keywords: ['六边形', '装饰'] },
  { name: 'Triangle', category: 'decoration', keywords: ['三角形', '装饰'] },
  { name: 'Zap', category: 'decoration', keywords: ['闪电', '能量'] },
  { name: 'CloudLightning', category: 'decoration', keywords: ['闪电', '云'] },
  { name: 'Gift', category: 'decoration', keywords: ['礼物', '装饰'] },
  { name: 'Ribbon', category: 'decoration', keywords: ['丝带', '装饰'] },
  { name: 'Crown', category: 'symbols', keywords: ['皇冠', '尊贵'] },
  { name: 'Gem', category: 'symbols', keywords: ['宝石', '珍贵'] },
  { name: 'Award', category: 'symbols', keywords: ['奖牌', '荣誉'] },
  { name: 'Shield', category: 'symbols', keywords: ['盾牌', '保护'] },
  { name: 'ShieldCheck', category: 'symbols', keywords: ['盾牌', '安全'] },
  { name: 'AlertTriangle', category: 'symbols', keywords: ['警告', '注意', '过敏'] },
  { name: 'Info', category: 'symbols', keywords: ['信息', '提示'] },
  { name: 'Check', category: 'symbols', keywords: ['对勾', '正确'] },
  { name: 'X', category: 'symbols', keywords: ['叉号', '错误'] },
  { name: 'Clock', category: 'symbols', keywords: ['时间', '保质期'] },
  { name: 'Calendar', category: 'symbols', keywords: ['日期', '批次'] },
  { name: 'Hash', category: 'symbols', keywords: ['编号', '批次'] },
  { name: 'Barcode', category: 'symbols', keywords: ['条码', '产品'] },
  { name: 'QrCode', category: 'symbols', keywords: ['二维码', '产品'] },
  { name: 'Leaf', category: 'nature', keywords: ['叶子', '有机'] },
  { name: 'Recycle', category: 'symbols', keywords: ['回收', '环保'] },
  { name: 'Globe', category: 'symbols', keywords: ['地球', '世界'] },
  { name: 'Hand', category: 'symbols', keywords: ['手工', '手作'] },
  { name: 'Users', category: 'symbols', keywords: ['人群', '团队'] },
];

export function getIconsByCategory(category: string): IconItem[] {
  if (category === 'all') return iconItems;
  return iconItems.filter(i => i.category === category);
}

export function searchIcons(query: string): IconItem[] {
  const lowerQuery = query.toLowerCase();
  return iconItems.filter(i =>
    i.name.toLowerCase().includes(lowerQuery) ||
    i.keywords.some(k => k.toLowerCase().includes(lowerQuery))
  );
}
