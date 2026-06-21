import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-sage-400' : type === 'error' ? 'bg-red-400' : 'bg-brown-400';
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : CheckCircle;

  return (
    <div className="no-print fixed top-20 right-4 z-[100] animate-slide-up">
      <div className={`${bgColor} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[200px]`}>
        <Icon size={20} />
        <span className="text-sm font-medium flex-1">{message}</span>
        <button
          onClick={onClose}
          className="p-0.5 rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
