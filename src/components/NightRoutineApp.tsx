import { useState, useEffect } from 'react';
import { TaskList } from './TaskList';
import { TaskAddForm } from './TaskAddForm';

interface Task {
  id: number;
  name: string;
  completed: boolean;
  completedAt?: string | null;
}

interface NightRoutineAppProps {
  onBack: () => void;
}

export function NightRoutineApp({ onBack }: NightRoutineAppProps) {
  const STORAGE_KEY = 'nightRoutineApp.tasks';

  const defaultTasks: Task[] = [
    { id: 1, name: '鍵の施錠', completed: false, completedAt: null },
    { id: 2, name: '歯磨き', completed: false, completedAt: null },
    { id: 3, name: '水分補給', completed: false, completedAt: null },
    { id: 4, name: '明日の服の準備', completed: false, completedAt: null },
  ];

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Task[];
        return parsed.map(p => ({
          id: p.id,
          name: p.name,
          completed: !!p.completed,
          completedAt: p.completedAt ?? null,
        }));
      }
    } catch (e) {
      // ignore parse errors and fall back to defaults
    }
    return defaultTasks;
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // persist to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      // ignore quota errors
    }
  }, [tasks]);

  const toggleTask = (id: number) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== id) return task;
        if (!task.completed) {
          return { ...task, completed: true, completedAt: new Date().toISOString() };
        }
        return { ...task, completed: false, completedAt: null };
      })
    );
  };

  const addTask = (name: string) => {
    setTasks(prev => {
      const nextId = prev.length ? Math.max(...prev.map(t => t.id)) + 1 : 1;
      return [...prev, { id: nextId, name, completed: false, completedAt: null }];
    });
  };

  const toggleSelectTask = (id: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const deleteSelectedTasks = () => {
    setTasks(prev => prev.filter(task => !selectedIds.has(task.id)));
    setSelectedIds(new Set());
    setIsEditMode(false);
  };

  const clearAllChecks = () => {
    setTasks(prev =>
      prev.map(task => ({
        ...task,
        completed: false,
        completedAt: null,
      }))
    );
  };

  const handleEditMode = () => {
    if (isEditMode) {
      // Cancel edit mode
      setSelectedIds(new Set());
    }
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition text-2xl p-2"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-gray-800">ナイトルーティン</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 flex items-start justify-center pt-4 px-4 pb-8">
        <div className="w-full max-w-md">
          {/* メインカード */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* タスク編集ボタン */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleEditMode}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition"
              >
                {isEditMode ? 'キャンセル' : 'タスク編集'}
              </button>
            </div>

            {/* タスクリスト */}
            <TaskList
              tasks={tasks}
              isEditMode={isEditMode}
              selectedIds={selectedIds}
              onToggleTask={toggleTask}
              onSelectTask={toggleSelectTask}
            />

            {isEditMode ? (
              <>
                {/* 削除ボタン (編集モード時) */}
                <button
                  onClick={deleteSelectedTasks}
                  disabled={selectedIds.size === 0}
                  className="w-full py-3 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium text-base shadow disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  選択したタスクを削除 ({selectedIds.size})
                </button>
              </>
            ) : (
              <>
                {/* タスク追加フォーム */}
                <TaskAddForm onAdd={addTask} />
                
                {/* 全チェックオフボタン */}
                <button
                  onClick={clearAllChecks}
                  className="w-full py-3 bg-blue-800 text-white rounded hover:bg-blue-900 transition font-medium text-base shadow"
                  title="すべてのチェックをオフ"
                >
                  全てのチェックをオフ
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
