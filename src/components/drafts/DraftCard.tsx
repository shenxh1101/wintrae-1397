import React from 'react';
import type { Draft } from '@/types';
import { Pencil, Trash2, Calendar, Tag } from 'lucide-react';

interface DraftCardProps {
  draft: Draft;
  onEdit: (draft: Draft) => void;
  onDelete: (draftId: string) => void;
}

export default function DraftCard({ draft, onEdit, onDelete }: DraftCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个草稿吗？此操作不可撤销。')) {
      onDelete(draft.id);
    }
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div
        className="aspect-square overflow-hidden bg-stone-100 cursor-pointer"
        onClick={() => onEdit(draft)}
      >
        {draft.thumbnail ? (
          <img
            src={draft.thumbnail}
            alt={draft.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400">
            <span className="text-4xl">🧼</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3
          className="font-semibold text-stone-800 truncate cursor-pointer hover:text-warm-brown-600 transition-colors"
          onClick={() => onEdit(draft)}
        >
          {draft.name}
        </h3>

        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(draft.updatedAt)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Tag className="w-3.5 h-3.5" />
            <span>
              {draft.labelData.ingredients.length} 种成分 |
              {draft.labelData.width.toFixed(1)} × {draft.labelData.height.toFixed(1)} cm
            </span>
          </div>
        </div>

        <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(draft)}
            className="flex-1 btn-secondary text-sm py-1.5 flex items-center justify-center gap-1.5"
          >
            <Pencil className="w-4 h-4" />
            编辑
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
