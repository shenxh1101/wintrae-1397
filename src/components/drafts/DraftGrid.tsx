import type { Draft } from '@/types';
import DraftCard from './DraftCard';
import EmptyState from '@/components/common/EmptyState';
import { FileText } from 'lucide-react';

interface DraftGridProps {
  drafts: Draft[];
  onEdit: (draft: Draft) => void;
  onDelete: (draftId: string) => void;
}

export default function DraftGrid({ drafts, onEdit, onDelete }: DraftGridProps) {
  if (drafts.length === 0) {
    return (
      <EmptyState
        icon={<FileText size={36} className="text-brown-300" />}
        title="暂无草稿"
        description="开始设计你的第一个手工皂标签吧！"
        action={{ label: '选择模板', to: '/' }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {drafts.map((draft) => (
        <DraftCard
          key={draft.id}
          draft={draft}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
