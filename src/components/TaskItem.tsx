interface TaskItemProps {
  task: {
    id: number;
    name: string;
    completed: boolean;
    completedAt?: string | null;
  };
  isEditMode: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onSelect: () => void;
}

export function TaskItem({ task, isEditMode, isSelected, onToggle, onSelect }: TaskItemProps) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded transition-all ${
        task.completed
          ? 'bg-green-100'
          : 'bg-white border border-gray-200'
      }`}
    >
      {isEditMode ? (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-5 h-5 rounded accent-blue-600 cursor-pointer flex-shrink-0"
        />
      ) : (
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
          className="w-5 h-5 rounded accent-green-600 cursor-pointer flex-shrink-0"
        />
      )}
      <div 
        className="flex-1 flex flex-col min-w-0 cursor-pointer"
        onClick={isEditMode ? onSelect : onToggle}
      >
        <span className="font-bold text-gray-800 text-base">
          {task.name}
        </span>
        {task.completed && task.completedAt && !isEditMode && (
          <span className="text-xs text-gray-600 mt-1">
            ({new Date(task.completedAt).toLocaleString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })})
          </span>
        )}
      </div>
    </div>
  );
}
