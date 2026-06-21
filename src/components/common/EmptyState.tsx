import { FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    to: string;
  };
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center mb-6">
        {icon || <FileText size={36} className="text-brown-300" />}
      </div>
      <h3 className="text-xl font-serif-sc font-semibold text-brown-600 mb-2">{title}</h3>
      <p className="text-brown-400 text-center max-w-sm mb-6">{description}</p>
      {action && (
        <Link
          to={action.to}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          {action.label}
        </Link>
      )}
    </div>
  );
}
