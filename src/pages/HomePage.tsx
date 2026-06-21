import { useState, useMemo } from 'react';
import { Sparkles, Palette, Layers, ChevronRight, FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import TemplateGrid from '@/components/template/TemplateGrid';
import TemplateFilter from '@/components/template/TemplateFilter';
import { labelTemplates } from '@/utils/templates';
import type { TemplateType, TemplateStyle } from '@/types';
import { useLabelStore } from '@/store/labelStore';

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<TemplateType | 'all'>('all');
  const [selectedStyle, setSelectedStyle] = useState<TemplateStyle | 'all'>('all');
  const drafts = useLabelStore((state) => state.drafts);

  const filteredTemplates = useMemo(() => {
    return labelTemplates.filter((template) => {
      const typeMatch = selectedType === 'all' || template.type === selectedType;
      const styleMatch = selectedStyle === 'all' || template.style === selectedStyle;
      return typeMatch && styleMatch;
    });
  }, [selectedType, selectedStyle]);

  const features = [
    {
      icon: Palette,
      title: '精美模板',
      description: '多种风格的预设模板，圆形贴纸、方形说明卡应有尽有',
    },
    {
      icon: Layers,
      title: '自由编辑',
      description: '拖拽调整文字与图标位置，自定义颜色搭配',
    },
    {
      icon: Sparkles,
      title: '智能排版',
      description: '自动按纸张规格生成打印版，支持多种导出格式',
    },
  ];

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-200/50 to-cream-100" />
        <div className="absolute inset-0 bg-noise opacity-50" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-brown-600 mb-6 shadow-soft">
              <Sparkles size={16} className="text-terracotta-400" />
              为手工皂小店量身定制
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif-sc font-bold text-brown-700 mb-4 leading-tight">
              设计专属于你的
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brown-500 to-terracotta-400">
                手工皂标签
              </span>
            </h1>
            <p className="text-lg md:text-xl text-brown-500 mb-8 max-w-2xl">
              选择模板、录入配方、拖拽排版，几分钟即可生成专业美观的产品标签和配方说明卡。
              支持打印排版和图片导出，让你的手工皂更添专业感。
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#templates"
                className="btn-primary text-lg px-6 py-3 flex items-center gap-2"
              >
                开始设计
                <ChevronRight size={20} />
              </a>
              {drafts.length > 0 && (
                <Link
                  to="/drafts"
                  className="btn-secondary text-lg px-6 py-3 flex items-center gap-2"
                >
                  <FileText size={20} />
                  我的草稿 ({drafts.length})
                </Link>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-cream-200 animate-slide-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brown-100 to-cream-200 flex items-center justify-center mb-4">
                    <Icon size={24} className="text-brown-500" />
                  </div>
                  <h3 className="font-serif-sc font-semibold text-brown-700 text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-brown-500 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif-sc font-bold text-brown-700 mb-2">选择模板</h2>
            <p className="text-brown-500">选择一个模板开始你的设计之旅</p>
          </div>
          {drafts.length > 0 && (
            <Link
              to="/drafts"
              className="hidden md:flex btn-secondary items-center gap-2"
            >
              <FileText size={18} />
              查看草稿
            </Link>
          )}
        </div>

        <TemplateFilter
          selectedType={selectedType}
          selectedStyle={selectedStyle}
          onTypeChange={setSelectedType}
          onStyleChange={setSelectedStyle}
        />

        <TemplateGrid templates={filteredTemplates} />
      </section>

        {/* Drafts Quick Access */}
        {drafts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 pb-16">
            <div className="bg-gradient-to-r from-cream-100 to-white rounded-3xl p-8 border border-cream-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-serif-sc font-bold text-brown-700 mb-2">继续编辑</h3>
                  <p className="text-brown-500">你有 {drafts.length} 个草稿等待完成</p>
                </div>
                <Link
                  to="/drafts"
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={18} />
                  查看全部
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {drafts.slice(0, 4).map((draft) => (
                  <Link
                    key={draft.id}
                    to={`/editor/${draft.labelData.templateId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      useLabelStore.getState().loadDraft(draft.id);
                      window.location.href = `/editor/${draft.labelData.templateId}`;
                    }}
                    className="group bg-white rounded-xl overflow-hidden border border-cream-200 hover:shadow-soft transition-all"
                  >
                    <div className="aspect-[4/3] bg-cream-50 overflow-hidden">
                      {draft.thumbnail ? (
                        <img
                          src={draft.thumbnail}
                          alt={draft.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText size={32} className="text-brown-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-brown-700 truncate">{draft.name}</p>
                      <p className="text-xs text-brown-400 mt-1">
                        {new Date(draft.updatedAt).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* Footer */}
      <footer className="border-t border-cream-200 bg-cream-50/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brown-300 to-brown-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">皂</span>
              </div>
              <span className="font-serif-sc font-semibold text-brown-600">手工皂标签设计工具</span>
            </div>
            <p className="text-sm text-brown-400">
              为手工皂小店打造 · 让每一块皂都有专属标签
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
