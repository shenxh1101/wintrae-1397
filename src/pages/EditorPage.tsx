import { useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useLabelStore } from '@/store/labelStore';
import Navbar from '@/components/common/Navbar';
import LeftPanel from '@/components/editor/LeftPanel';
import RightPanel from '@/components/editor/RightPanel';
import Canvas from '@/components/editor/Canvas';
import { useAutoSave } from '@/hooks/useAutoSave';
import { getTemplateById } from '@/utils/templates';

export default function EditorPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const currentLabel = useLabelStore((state) => state.currentLabel);
  const initLabelFromTemplate = useLabelStore((state) => state.initLabelFromTemplate);
  const canvasRef = useRef<HTMLDivElement>(null);

  useAutoSave(canvasRef);

  useEffect(() => {
    if (!currentLabel && templateId) {
      initLabelFromTemplate(templateId);
    }
  }, [templateId, currentLabel, initLabelFromTemplate]);

  if (!templateId || !getTemplateById(templateId)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-screen flex flex-col bg-cream-100">
      <Navbar canvasRef={canvasRef} showEditorActions={true} />

      <div className="flex-1 flex overflow-hidden">
        <LeftPanel />

        <div className="flex-1 flex flex-col relative">
          <Canvas canvasRef={canvasRef} />
        </div>

        <RightPanel />
      </div>
    </div>
  );
}
