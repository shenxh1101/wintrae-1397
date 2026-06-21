import { Link } from 'react-router-dom';
import { Circle, Square, RectangleHorizontal, Sparkles } from 'lucide-react';
import type { LabelTemplate } from '@/types';

interface TemplateCardProps {
  template: LabelTemplate;
  index: number;
}

const typeIcons = {
  circle: Circle,
  square: Square,
  rectangle: RectangleHorizontal,
  special: Sparkles,
};

const typeLabels = {
  circle: '圆形',
  square: '方形',
  rectangle: '长方形',
  special: '异形',
};

const styleLabels = {
  minimal: '简约',
  vintage: '复古',
  fresh: '清新',
  luxury: '奢华',
  cute: '可爱',
};

const styleColors = {
  minimal: 'bg-brown-100 text-brown-600',
  vintage: 'bg-terracotta-100 text-terracotta-400',
  fresh: 'bg-sage-100 text-sage-500',
  luxury: 'bg-lavender-100 text-lavender-400',
  cute: 'bg-blush-100 text-blush-300',
};

export default function TemplateCard({ template, index }: TemplateCardProps) {
  const TypeIcon = typeIcons[template.type];

  return (
    <Link
      to={`/editor/${template.id}`}
      className="group card p-4 hover:shadow-hover transition-all duration-300 hover:-translate-y-1 animate-slide-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="aspect-square rounded-xl bg-paper flex items-center justify-center mb-4 overflow-hidden border border-cream-200">
        <div
          className="drop-shadow-label flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
          style={{
            width: template.type === 'circle' ? '70%' : '80%',
            height: template.type === 'circle' ? '70%' : '80%',
            borderRadius: template.type === 'circle' ? '50%' : '8px',
            backgroundColor: template.defaultColors.background,
            border: `2px solid ${template.defaultColors.primary}`,
          }}
        >
          <div className="text-center px-4">
            <div
              className="font-serif-sc font-bold mb-1"
              style={{ color: template.defaultColors.text }}
            >
              {template.name}
            </div>
            <div
              className="text-xs"
              style={{ color: template.defaultColors.secondary }}
            >
              {template.defaultWidth}×{template.defaultHeight}cm
            </div>
            <div className="flex justify-center gap-1 mt-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: [
                      template.defaultColors.primary,
                      template.defaultColors.secondary,
                      template.defaultColors.accent,
                    ][i],
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-serif-sc font-semibold text-brown-700 group-hover:text-brown-500 transition-colors">
            {template.name}
          </h3>
          <p className="text-sm text-brown-400 mt-0.5">
            {template.defaultWidth} × {template.defaultHeight} cm
          </p>
        </div>
        <div className="flex gap-1">
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${styleColors[template.style]}`}>
            {styleLabels[template.style]}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <TypeIcon size={14} className="text-brown-400" />
        <span className="text-xs text-brown-400">{typeLabels[template.type]}</span>
      </div>
    </Link>
  );
}
