import { Link, useLocation } from 'react-router-dom';
import { Home, Eye, FileText, Save, Undo2, Redo2 } from 'lucide-react';
import { useLabelStore } from '@/store/labelStore';
import { generateThumbnail } from '@/utils/export';
import { useState } from 'react';
import Toast from './Toast';

interface NavbarProps {
  canvasRef?: React.RefObject<HTMLElement>;
  showEditorActions?: boolean;
}

export default function Navbar({ canvasRef, showEditorActions = false }: NavbarProps) {
  const location = useLocation();
  const currentLabel = useLabelStore((state) => state.currentLabel);
  const undo = useLabelStore((state) => state.undo);
  const redo = useLabelStore((state) => state.redo);
  const history = useLabelStore((state) => state.history);
  const saveDraft = useLabelStore((state) => state.saveDraft);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const navItems = [
    { path: '/', label: '模板', icon: Home },
    { path: '/drafts', label: '草稿', icon: FileText },
  ];

  const handleSave = async () => {
    if (!currentLabel || !canvasRef?.current) return;
    
    try {
      const thumbnail = await generateThumbnail(canvasRef.current);
      const draftName = currentLabel.name || `未命名草稿 ${new Date().toLocaleString('zh-CN')}`;
      saveDraft(draftName, thumbnail);
      setToast({ show: true, message: '保存成功', type: 'success' });
    } catch (e) {
      setToast({ show: true, message: '保存失败', type: 'error' });
    }
  };

  return (
    <>
      <nav className="no-print sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-cream-200">
        <div className="max-w-[1920px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brown-300 to-brown-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">皂</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-serif-sc font-bold text-brown-600 text-lg">手工皂标签设计</h1>
                <p className="text-xs text-brown-400">Soap Label Designer</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path === '/editor' && location.pathname.startsWith('/editor'));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-brown-100 text-brown-600'
                        : 'text-brown-500 hover:bg-cream-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showEditorActions && currentLabel && (
              <>
                <div className="hidden lg:flex items-center gap-1 mr-2 border-r border-cream-200 pr-2">
                  <button
                    onClick={undo}
                    disabled={history.past.length === 0}
                    className="btn-icon disabled:opacity-30"
                    title="撤销"
                  >
                    <Undo2 size={18} />
                  </button>
                  <button
                    onClick={redo}
                    disabled={history.future.length === 0}
                    className="btn-icon disabled:opacity-30"
                    title="重做"
                  >
                    <Redo2 size={18} />
                  </button>
                </div>

                <button
                  onClick={handleSave}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Save size={16} />
                  <span className="hidden sm:inline">保存</span>
                </button>

                <Link
                  to="/preview"
                  className="btn-primary flex items-center gap-2"
                >
                  <Eye size={16} />
                  <span className="hidden sm:inline">预览打印</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
        />
      )}
    </>
  );
}
