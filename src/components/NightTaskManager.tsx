import { useState, useEffect } from 'react';

interface Task {
  id: number;
  name: string;
  completed: boolean;
  completedAt?: string | null;
}

interface NightTaskManagerProps {
  onBack: () => void;
}

export function NightTaskManager({ onBack }: NightTaskManagerProps) {
  const STORAGE_KEY = 'nightTaskManager.tasks';

  const defaultTasks: Task[] = [
    { id: 1, name: '歯磨き', completed: false, completedAt: null },
    { id: 2, name: '水分補給', completed: false, completedAt: null },
    { id: 3, name: '保湿クリームを塗る', completed: false, completedAt: null },
    { id: 4, name: '明日着る服を用意する', completed: false, completedAt: null },
  ];

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Task[];
        // ensure parsed tasks have required shape
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

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== id) return task;
      return {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null,
      };
    }));
  };

  // persist to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      // ignore quota errors
    }
  }, [tasks]);

  // 新規タスク入力用の状態
  const [newTaskName, setNewTaskName] = useState('');

  const addTask = () => {
    const name = newTaskName.trim();
    if (!name) return;
    setTasks(prev => {
      const nextId = prev.length ? Math.max(...prev.map(t => t.id)) + 1 : 1;
      return [...prev, { id: nextId, name, completed: false, completedAt: null }];
    });
    setNewTaskName('');
  };

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 transition-colors text-3xl font-bold hover:bg-gray-100 rounded-lg p-2"
          >
            ←
          </button>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-800">🌙 夜のルーティン</h1>
          </div>
          <div className="w-12"></div>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* 説明文 + 新規追加フォーム */}
            <p className="text-center text-gray-600 mb-4">寝る前のタスクをチェック</p>
            <form
              onSubmit={(e) => { e.preventDefault(); addTask(); }}
              className="flex items-center gap-2 mb-6"
            >
              <input
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="新しいタスクを追加（例：読書をする）"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                aria-label="新しいタスク名"
              />
              <button
                type="submit"
                onClick={addTask}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                追加
              </button>
            </form>

            {/* 進捗表示 */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">進捗</span>
                <span className="text-sm font-semibold text-indigo-600">{completedCount} / {tasks.length}</span>
              </div>
              {/* <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                ></div>
              </div> */}
            </div>

            {/* タスクリスト */}
            <div className="space-y-3">
              {tasks.map(task => (
                <label
                  key={task.id}
                  className={`flex items-center p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-indigo-50 border-indigo-300'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-6 h-6 rounded-lg accent-indigo-500 cursor-pointer"
                  />
                  <div className="ml-4 flex flex-col">
                    <span
                      className={`text-lg font-medium transition-all ${
                        task.completed
                          ? 'text-gray-400 line-through'
                          : 'text-gray-800'
                      }`}
                    >
                      {task.name}
                    </span>
                    {task.completed && task.completedAt && (
                      <span className="text-sm text-gray-500 mt-1">
                        {new Date(task.completedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {task.completed && (
                    <span className="ml-auto text-2xl">✓</span>
                  )}
                </label>
              ))}
            </div>

            {/* 完了メッセージ */}
            {completedCount === tasks.length && (
              <div className="mt-8 p-4 bg-green-100 border-l-4 border-green-500 rounded">
                <p className="text-green-700 font-semibold text-center">
                  🎉 すべてのタスク完了！おやすみなさい
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
