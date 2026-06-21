import TemplateCard from './TemplateCard';
import type { LabelTemplate } from '@/types';

interface TemplateGridProps {
  templates: LabelTemplate[];
}

export default function TemplateGrid({ templates }: TemplateGridProps) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-brown-400 text-lg">没有找到匹配的模板</div>
        <p className="text-brown-300 mt-2">试试其他筛选条件</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {templates.map((template, index) => (
        <TemplateCard key={template.id} template={template} index={index} />
      ))}
    </div>
  );
}
