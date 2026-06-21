import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from '@/pages/HomePage';
import EditorPage from '@/pages/EditorPage';
import PreviewPage from '@/pages/PreviewPage';
import DraftsPage from '@/pages/DraftsPage';
import { useLabelStore } from '@/store/labelStore';

export default function App() {
  const loadDraftsFromStorage = useLabelStore((state) => state.loadDraftsFromStorage);

  useEffect(() => {
    loadDraftsFromStorage();
  }, [loadDraftsFromStorage]);

  return (
    <div className="min-h-screen bg-cream-100">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor/:templateId" element={<EditorPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/drafts" element={<DraftsPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}
