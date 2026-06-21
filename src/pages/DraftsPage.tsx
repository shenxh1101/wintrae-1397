import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLabelStore } from '@/store/labelStore';
import Navbar from '@/components/common/Navbar';
import DraftGrid from '@/components/drafts/DraftGrid';
import { FileText, Search, Trash2 } from 'lucide-react';
import Toast from '@/components/common/Toast';

export default function DraftsPage() {
  const navigate = useNavigate();
  const drafts = useLabelStore((state) => state.drafts);
  const loadDraft = useLabelStore((state) => state.loadDraft);
  const deleteDraft = useLabelStore((state) => state.deleteDraft);
  const loadDraftsFromStorage = useLabelStore((state) => state.loadDraftsFromStorage);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    loadDraftsFromStorage();
  }, [loadDraftsFromStorage]);

  const filteredDrafts = drafts.filter((draft) =>
    draft.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (draft: any) => {
    loadDraft(draft.id);
    navigate(`/editor/${draft.labelData.templateId}`);
  };

  const handleDelete = (draftId: string) => {
    deleteDraft(draftId);
    setToast({ show: true, message: '草稿已删除', type: 'success' });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleClearAll = () => {
    if (window.confirm(`确定要删除所有 ${drafts.length} 个草稿吗？此操作不可撤销。`)) {
      drafts.forEach((draft) => deleteDraft(draft.id));
      setToast({ show: true, message: '所有草稿已删除', type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-warm-brown-100 rounded-xl">
              <FileText className="w-6 h-6 text-warm-brown-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-800">我的草稿</h1>
              <p className="text-stone-500">管理你保存的所有标签设计</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="搜索草稿..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-stone-500">
                共 {filteredDrafts.length} 个草稿
              </span>
              
              {drafts.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  清空全部
                </button>
              )}
            </div>
          </div>
        </div>

        <DraftGrid
          drafts={filteredDrafts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
        />
      )}
    </div>
  );
}
