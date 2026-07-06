import { Eye, Edit, Copy, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
}

export function ActionButtons({ onView, onEdit, onCopy, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      {onView && (
        <button
          onClick={onView}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="Visualiser"
        >
          <Eye className="w-4 h-4 text-gray-600" />
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="Modifier"
        >
          <Edit className="w-4 h-4 text-gray-600" />
        </button>
      )}
      {onCopy && (
        <button
          onClick={onCopy}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="Dupliquer"
        >
          <Copy className="w-4 h-4 text-gray-600" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4 text-[#C62828]" />
        </button>
      )}
    </div>
  );
}
