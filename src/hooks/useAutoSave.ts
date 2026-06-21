import { useEffect, useRef } from 'react';
import { useLabelStore } from '@/store/labelStore';
import { generateThumbnail } from '@/utils/export';

export function useAutoSave(canvasRef: React.RefObject<HTMLElement>) {
  const currentLabel = useLabelStore((state) => state.currentLabel);
  const saveDraft = useLabelStore((state) => state.saveDraft);
  const autoSaveEnabled = useLabelStore((state) => state.autoSaveEnabled);
  const lastSaveRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoSaveEnabled || !currentLabel || !canvasRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const canvasElement = canvasRef.current;

    timeoutRef.current = window.setTimeout(async () => {
      const now = Date.now();
      if (now - lastSaveRef.current < 5000) return;

      try {
        const thumbnail = await generateThumbnail(canvasElement);
        const draftName = currentLabel.name || `未命名草稿 ${new Date().toLocaleString('zh-CN')}`;
        saveDraft(draftName, thumbnail);
        lastSaveRef.current = now;
      } catch (e) {
        console.error('Auto-save failed:', e);
      }
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentLabel, autoSaveEnabled, canvasRef, saveDraft]);
}
