import { TaskItem } from './TaskItem';

interface Task {
  id: number;
  name: string;
  completed: boolean;
  completedAt?: string | null;
}

interface TaskListProps {
  tasks: Task[];
  isEditMode: boolean;
  selectedIds: Set<number>;
  onToggleTask: (id: number) => void;
  onSelectTask: (id: number) => void;
}

export function TaskList({ tasks, isEditMode, selectedIds, onToggleTask, onSelectTask }: TaskListProps) {
  return (
    <div className="space-y-3 mb-6">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          isEditMode={isEditMode}
          isSelected={selectedIds.has(task.id)}
          onToggle={() => onToggleTask(task.id)}
          onSelect={() => onSelectTask(task.id)}
        />
      ))}
    </div>
  );
}
