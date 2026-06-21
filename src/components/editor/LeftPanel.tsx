import { useState } from 'react';
import { ChevronDown, Image, Package } from 'lucide-react';
import IconLibrary from './IconLibrary';
import FormSection from './FormSection';

export default function LeftPanel() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['form', 'icons']);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const sections = [
    {
      id: 'form',
      title: '产品信息',
      icon: Package,
      content: <FormSection />,
    },
    {
      id: 'icons',
      title: '图标素材',
      icon: Image,
      content: <IconLibrary />,
    },
  ];

  return (
    <div className="no-print w-80 border-r border-cream-200 bg-white overflow-y-auto h-full">
      <div className="p-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.includes(section.id);
          return (
            <div key={section.id} className="mb-4">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-3 bg-cream-50 rounded-xl hover:bg-cream-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon size={18} className="text-brown-500" />
                  <span className="font-medium text-brown-700">{section.title}</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-brown-400 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isExpanded && (
                <div className="mt-3 animate-fade-in">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
